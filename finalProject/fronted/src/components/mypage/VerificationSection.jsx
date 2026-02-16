import React, { useState, useRef } from 'react';
import { ShieldCheck, Upload, Clock, CheckCircle2, XCircle, FileImage, Loader2 } from 'lucide-react';
import { useVerificationStatus, useSubmitVerification } from '../../api/verification/useVerification';

export default function VerificationSection() {
  const { data, isLoading } = useVerificationStatus();
  const submitMutation = useSubmitVerification();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const verification = data?.data;
  const status = verification?.status;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하만 가능합니다.');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!selectedFile) return;
    submitMutation.mutate(selectedFile, {
      onSuccess: (res) => {
        if (res.success) {
          alert('인증 서류가 제출되었습니다. 관리자 검토 후 승인됩니다.');
          setSelectedFile(null);
          setPreview(null);
        } else {
          alert(res.message || '제출에 실패했습니다.');
        }
      },
      onError: () => alert('제출 중 오류가 발생했습니다.'),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4" style={{ fontFamily: "'Pretendard', sans-serif" }}>
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        리뷰어 인증
      </h3>

      {/* 승인 완료 */}
      {status === 'Y' && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          <div>
            <p className="font-bold text-emerald-700">인증 완료</p>
            <p className="text-sm text-emerald-600">인증된 리뷰어로 숙소 후기를 작성할 수 있습니다.</p>
          </div>
        </div>
      )}

      {/* 대기 중 */}
      {status === 'W' && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <Clock className="w-8 h-8 text-amber-500" />
          <div>
            <p className="font-bold text-amber-700">심사 대기 중</p>
            <p className="text-sm text-amber-600">관리자가 서류를 검토하고 있습니다. 잠시만 기다려주세요.</p>
            {verification?.submittedAt && (
              <p className="text-xs text-amber-500 mt-1">제출일: {verification.submittedAt}</p>
            )}
          </div>
        </div>
      )}

      {/* 거부됨 */}
      {status === 'R' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="font-bold text-red-700">인증 거부</p>
              {verification?.adminComment && (
                <p className="text-sm text-red-600">사유: {verification.adminComment}</p>
              )}
              <p className="text-xs text-red-500 mt-1">서류를 다시 제출해주세요.</p>
            </div>
          </div>
          {/* 재제출 폼 아래에 표시 */}
        </div>
      )}

      {/* 미제출 또는 거부 후 재제출 */}
      {(!status || status === 'R') && (
        <div className="mt-4 space-y-4">
          {!status && (
            <p className="text-sm text-slate-500">
              숙소 후기를 작성하려면 숙박 예약확인서 등 인증서류를 제출해주세요.
            </p>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-sky-300 rounded-xl p-6 text-center cursor-pointer transition-colors"
          >
            {preview ? (
              <img src={preview} alt="미리보기" className="max-h-48 mx-auto rounded-lg" />
            ) : (
              <div className="space-y-2">
                <FileImage className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">클릭하여 인증서류 이미지를 선택하세요</p>
                <p className="text-xs text-slate-400">JPG, PNG (최대 10MB)</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile && (
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> 제출 중...</>
              ) : (
                <><Upload className="w-4 h-4" /> 인증서류 제출</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
