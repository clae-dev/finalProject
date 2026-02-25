package edu.kh.project.freeboard.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.kh.project.common.util.JwtUtil;
import edu.kh.project.freeboard.dto.CommentDTO;
import edu.kh.project.freeboard.dto.FreeBoardDTO;
import edu.kh.project.freeboard.service.FreeBoardService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 자유게시판 API 컨트롤러
 *
 * <p>자유게시판(BOARD_TYPE_NO=2)의 게시글 CRUD, 댓글(대댓글),
 * 좋아요 토글 등의 API를 제공한다.</p>
 *
 * @author HONDI
 */
@RestController
@RequestMapping("/api/freeboards")
@RequiredArgsConstructor
@Slf4j
public class FreeBoardController {

    private final FreeBoardService freeBoardService;
    private final JwtUtil jwtUtil;

    @Value("${board.image.web-path}")
    private String boardWebPath;

    @Value("${board.image.folder-path}")
    private String boardFolderPath;

    /** Authorization 헤더에서 회원 번호 추출 */
    private int extractMemberNo(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getMemberNo(token);
    }

    /** Authorization 헤더에서 회원 권한 추출 */
    private String extractRole(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getRole(token);
    }

    /**
     * 게시글 목록 (페이징 + 검색)
     * GET /api/freeboards?page=1&size=9&search=키워드
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getFreeBoardList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) String search) {

        size = Math.min(size, 100);
        Map<String, Object> response = new HashMap<>();

        try {
            List<FreeBoardDTO> list = freeBoardService.getFreeBoardList(page, size, search);
            int totalCount = freeBoardService.getFreeBoardCount(search);

            response.put("success", true);
            response.put("list", list);
            response.put("totalCount", totalCount);
            response.put("currentPage", page);
            response.put("pageSize", size);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("자유게시판 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "게시글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 게시글 상세 조회 + 조회수 증가
     * GET /api/freeboards/{boardNo}
     */
    @GetMapping("/{boardNo}")
    public ResponseEntity<Map<String, Object>> getFreeBoardDetail(
            @PathVariable("boardNo") int boardNo,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = 0;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    memberNo = extractMemberNo(authHeader);
                } catch (Exception ignored) {}
            }

            FreeBoardDTO board = freeBoardService.getFreeBoardDetail(boardNo, memberNo);

            if (board == null) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            response.put("success", true);
            response.put("data", board);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("자유게시판 상세 조회 실패", e);
            response.put("success", false);
            response.put("message", "게시글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 게시글 작성 (multipart: title, content, images[])
     * POST /api/freeboards
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createFreeBoard(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            FreeBoardDTO board = new FreeBoardDTO();
            board.setBoardTitle(title);
            board.setBoardContent(content);
            board.setMemberNo(memberNo);

            int result = freeBoardService.createFreeBoard(board, images,
                    boardWebPath, boardFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "작성 완료" : "작성 실패");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("자유게시판 작성 실패", e);
            response.put("success", false);
            response.put("message", "게시글 작성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 게시글 수정 (작성자만)
     * PUT /api/freeboards/{boardNo}
     */
    @PutMapping("/{boardNo}")
    public ResponseEntity<Map<String, Object>> updateFreeBoard(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            FreeBoardDTO board = new FreeBoardDTO();
            board.setBoardNo(boardNo);
            board.setBoardTitle(title);
            board.setBoardContent(content);
            board.setMemberNo(memberNo);

            int result = freeBoardService.updateFreeBoard(board, images,
                    boardWebPath, boardFolderPath);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "수정 완료" : "수정 실패 (권한 없음)");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("자유게시판 수정 실패", e);
            response.put("success", false);
            response.put("message", "게시글 수정 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 게시글 삭제 (작성자 또는 관리자, soft delete)
     * DELETE /api/freeboards/{boardNo}
     */
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<Map<String, Object>> deleteFreeBoard(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            String role = extractRole(authHeader);
            boolean isAdmin = "A".equals(role);

            int result;
            if (isAdmin) {
                result = freeBoardService.adminDeleteFreeBoard(boardNo);
            } else {
                result = freeBoardService.deleteFreeBoard(boardNo, memberNo);
            }

            response.put("success", result > 0);
            response.put("message", result > 0 ? "삭제 완료" : "삭제 실패 (권한 없음)");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("자유게시판 삭제 실패", e);
            response.put("success", false);
            response.put("message", "게시글 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 댓글 목록 (대댓글 포함)
     * GET /api/freeboards/{boardNo}/comments
     */
    @GetMapping("/{boardNo}/comments")
    public ResponseEntity<Map<String, Object>> getCommentList(
            @PathVariable("boardNo") int boardNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            List<CommentDTO> comments = freeBoardService.getCommentList(boardNo);

            response.put("success", true);
            response.put("list", comments);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("댓글 목록 조회 실패", e);
            response.put("success", false);
            response.put("message", "댓글 조회 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 댓글 작성
     * POST /api/freeboards/{boardNo}/comments
     */
    @PostMapping("/{boardNo}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo,
            @RequestParam("content") String content,
            @RequestParam(value = "parentCommentNo", required = false) Integer parentCommentNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);

            CommentDTO comment = new CommentDTO();
            comment.setBoardNo(boardNo);
            comment.setMemberNo(memberNo);
            comment.setContent(content);
            comment.setParentCommentNo(parentCommentNo);

            int result = freeBoardService.createComment(comment);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "댓글 작성 완료" : "댓글 작성 실패");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("댓글 작성 실패", e);
            response.put("success", false);
            response.put("message", "댓글 작성 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 댓글 삭제 (작성자만)
     * DELETE /api/freeboards/comments/{commentNo}
     */
    @DeleteMapping("/comments/{commentNo}")
    public ResponseEntity<Map<String, Object>> deleteComment(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("commentNo") int commentNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            int result = freeBoardService.deleteComment(commentNo, memberNo);

            response.put("success", result > 0);
            response.put("message", result > 0 ? "댓글 삭제 완료" : "댓글 삭제 실패 (권한 없음)");
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("댓글 삭제 실패", e);
            response.put("success", false);
            response.put("message", "댓글 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 좋아요 토글
     * POST /api/freeboards/{boardNo}/like
     */
    @PostMapping("/{boardNo}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable("boardNo") int boardNo) {

        Map<String, Object> response = new HashMap<>();

        try {
            int memberNo = extractMemberNo(authHeader);
            Map<String, Object> result = freeBoardService.toggleLike(boardNo, memberNo);

            response.put("success", true);
            response.put("liked", result.get("liked"));
            response.put("likeCount", result.get("likeCount"));
            return ResponseEntity.ok(response);

        } catch (JwtException e) {
            response.put("success", false);
            response.put("message", "인증이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            log.error("좋아요 토글 실패", e);
            response.put("success", false);
            response.put("message", "좋아요 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
