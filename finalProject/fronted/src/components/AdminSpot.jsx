import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiArrowLeft, FiImage, FiSave, FiX
} from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

function AdminSpot() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [formData, setFormData] = useState({
    spotTitle: '',
    spotDesc: '',
    spotLocation: '',
    spotImage: '',
    spotTag: '',
    spotOrder: 0,
    spotSize: 'small'
  });

  // 관리자 권한 체크
  useEffect(() => {
    if (user?.memberRole !== 'ADMIN') {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
    }
  }, [user, navigate]);

  // 명소 목록 불러오기
  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch(`${API_BASE}/spot/admin`);
      const data = await res.json();
      if (data.success) {
        setSpots(data.data || []);
      }
    } catch (error) {
      console.error('명소 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingSpot(null);
    setFormData({
      spotTitle: '',
      spotDesc: '',
      spotLocation: '',
      spotImage: '',
      spotTag: '',
      spotOrder: spots.length + 1,
      spotSize: 'small'
    });
    setShowModal(true);
  };

  const openEditModal = (spot) => {
    setEditingSpot(spot);
    setFormData({
      spotTitle: spot.spotTitle,
      spotDesc: spot.spotDesc || '',
      spotLocation: spot.spotLocation || '',
      spotImage: spot.spotImage,
      spotTag: spot.spotTag || '',
      spotOrder: spot.spotOrder,
      spotSize: spot.spotSize || 'small'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingSpot
        ? `${API_BASE}/spot/${editingSpot.spotNo}`
        : `${API_BASE}/spot`;

      const res = await fetch(url, {
        method: editingSpot ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert(editingSpot ? '명소가 수정되었습니다.' : '명소가 등록되었습니다.');
        setShowModal(false);
        fetchSpots();
      } else {
        alert(data.message || '작업에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (spotNo) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`${API_BASE}/spot/${spotNo}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        alert('삭제되었습니다.');
        fetchSpots();
      } else {
        alert(data.message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleToggleStatus = async (spot) => {
    const newStatus = spot.spotStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const res = await fetch(`${API_BASE}/spot/${spot.spotNo}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      const data = await res.json();

      if (data.success) {
        fetchSpots();
      } else {
        alert(data.message || '상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  if (user?.memberRole !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">명소 관리</h1>
                <p className="text-sm text-gray-500">메인 페이지에 표시될 제주 명소를 관리합니다</p>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-jeju-600 hover:bg-jeju-700 text-white font-medium rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              명소 추가
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">불러오는 중...</div>
        ) : spots.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">등록된 명소가 없습니다.</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-jeju-600 hover:text-jeju-700 font-medium"
            >
              첫 번째 명소 등록하기
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {spots.map((spot) => (
              <div
                key={spot.spotNo}
                className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all ${
                  spot.spotStatus === 'INACTIVE' ? 'opacity-50 border-gray-200' : 'border-gray-200 hover:border-jeju-200'
                }`}
              >
                {/* 이미지 미리보기 */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={spot.spotImage}
                    alt={spot.spotTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/96?text=No+Image';
                    }}
                  />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400">#{spot.spotOrder}</span>
                    {spot.spotSize === 'large' && (
                      <span className="px-2 py-0.5 bg-jeju-100 text-jeju-700 text-xs font-medium rounded">
                        대형
                      </span>
                    )}
                    {spot.spotTag && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                        {spot.spotTag}
                      </span>
                    )}
                    {spot.spotStatus === 'INACTIVE' && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                        숨김
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{spot.spotTitle}</h3>
                  <p className="text-sm text-gray-500 truncate">{spot.spotDesc || '설명 없음'}</p>
                  <p className="text-xs text-gray-400 mt-1">{spot.spotLocation}</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleStatus(spot)}
                    className={`p-2 rounded-lg transition-colors ${
                      spot.spotStatus === 'ACTIVE'
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={spot.spotStatus === 'ACTIVE' ? '숨기기' : '표시하기'}
                  >
                    {spot.spotStatus === 'ACTIVE' ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => openEditModal(spot)}
                    className="p-2 text-gray-500 hover:text-jeju-600 hover:bg-jeju-50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(spot.spotNo)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingSpot ? '명소 수정' : '명소 등록'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 이미지 미리보기 */}
              {formData.spotImage && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.spotImage}
                    alt="미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이미지 URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="spotImage"
                  value={formData.spotImage}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="spotTitle"
                  value={formData.spotTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="성산일출봉"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  name="spotDesc"
                  value={formData.spotDesc}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="명소에 대한 간단한 설명"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                  <input
                    type="text"
                    name="spotLocation"
                    value={formData.spotLocation}
                    onChange={handleInputChange}
                    placeholder="서귀포시"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">태그</label>
                  <input
                    type="text"
                    name="spotTag"
                    value={formData.spotTag}
                    onChange={handleInputChange}
                    placeholder="UNESCO 세계자연유산"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                  <input
                    type="number"
                    name="spotOrder"
                    value={formData.spotOrder}
                    onChange={handleInputChange}
                    min={1}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카드 크기</label>
                  <select
                    name="spotSize"
                    value={formData.spotSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-jeju-500 focus:border-transparent outline-none"
                  >
                    <option value="small">일반</option>
                    <option value="large">대형 (2x2)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-jeju-600 hover:bg-jeju-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  {editingSpot ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSpot;
