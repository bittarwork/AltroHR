import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiCalendar,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiFileText,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import ModalWrapper from "../common/ModalWrapper";

const LeaveManagementTab = ({ onStatsUpdate }) => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const loadLeaveRequests = async () => {
    try {
      setLoading(true);
      const token = user?.token;
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/leaves`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeaveRequests(response.data || []);
      onStatsUpdate?.();
    } catch (error) {
      console.error("خطأ في تحميل طلبات الإجازة:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (requestId, status) => {
    try {
      setUpdatingStatus(requestId);
      const token = user?.token;
      if (!token) return;

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/leaves/${requestId}/review`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLeaveRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status } : req))
      );

      onStatsUpdate?.();
    } catch (error) {
      console.error("خطأ في تحديث حالة الطلب:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="mr-1" size={12} />;
      case "rejected":
        return <FiXCircle className="mr-1" size={12} />;
      default:
        return <FiAlertCircle className="mr-1" size={12} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "موافق عليه";
      case "rejected":
        return "مرفوض";
      default:
        return "في الانتظار";
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            إدارة الإجازات
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            إجمالي الطلبات: {filteredRequests.length}
          </p>
        </div>
        <button
          onClick={loadLeaveRequests}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${
          darkMode ? "bg-gray-700" : "bg-gray-50"
        } rounded-lg p-4 mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="البحث بالاسم أو نوع الإجازة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-10 pl-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
          >
            <option value="">جميع الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="approved">موافق عليه</option>
            <option value="rejected">مرفوض</option>
          </select>

          {/* Placeholder for additional filters */}
          <div></div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } relative rounded-lg shadow overflow-visible`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الموظف
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  نوع الإجازة
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  التاريخ
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  المدة
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الحالة
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FiCalendar
                      className={`mx-auto h-12 w-12 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } mb-4`}
                    />
                    <p
                      className={`text-lg font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      لا توجد طلبات إجازة
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full ${
                            darkMode ? "bg-gray-600" : "bg-gray-200"
                          } flex items-center justify-center`}
                        >
                          <FiUser
                            className={`h-5 w-5 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div className="mr-4">
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {request.user?.name || "غير محدد"}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {request.user?.email || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {request.leaveType || "غير محدد"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <div>
                        <div>
                          من:{" "}
                          {new Date(request.startDate).toLocaleDateString(
                            "ar-SA"
                          )}
                        </div>
                        <div>
                          إلى:{" "}
                          {new Date(request.endDate).toLocaleDateString(
                            "ar-SA"
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {Math.ceil(
                        (new Date(request.endDate) -
                          new Date(request.startDate)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      يوم
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="عرض التفاصيل"
                        >
                          <FiEye />
                        </button>
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateLeaveStatus(request._id, "approved")
                              }
                              disabled={updatingStatus === request._id}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              title="موافقة"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() =>
                                updateLeaveStatus(request._id, "rejected")
                              }
                              disabled={updatingStatus === request._id}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                              title="رفض"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Request Details Modal */}
      <ModalWrapper
        isOpen={showDetailsModal && !!selectedRequest}
        onClose={() => setShowDetailsModal(false)}
        size="lg"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <FiCalendar
                    className="text-green-600 dark:text-green-400"
                    size={20}
                  />
                </div>
                <h2 className="text-xl font-bold">تفاصيل طلب الإجازة</h2>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FiUser className="text-gray-500" />
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRequest?.user?.name || "غير محدد"}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    اسم الموظف
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <FiFileText className="text-gray-500" />
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRequest?.leaveType || "غير محدد"}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    نوع الإجازة
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <FiCalendar className="text-gray-500" />
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    من{" "}
                    {selectedRequest &&
                      selectedRequest.startDate &&
                      new Date(selectedRequest.startDate).toLocaleDateString(
                        "ar-SA"
                      )}
                    إلى{" "}
                    {selectedRequest &&
                      selectedRequest.endDate &&
                      new Date(selectedRequest.endDate).toLocaleDateString(
                        "ar-SA"
                      )}
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    فترة الإجازة
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <FiClock className="text-gray-500" />
                <div>
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedRequest &&
                      Math.ceil(
                        (new Date(selectedRequest.endDate) -
                          new Date(selectedRequest.startDate)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                    يوم
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    مدة الإجازة
                  </p>
                </div>
              </div>

              {selectedRequest?.reason && (
                <div className="space-y-2">
                  <p
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    السبب:
                  </p>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } p-3 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    {selectedRequest.reason}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedRequest?.status === "pending" && (
              <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    updateLeaveStatus(selectedRequest._id, "rejected");
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  رفض
                </button>
                <button
                  onClick={() => {
                    updateLeaveStatus(selectedRequest._id, "approved");
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  موافقة
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </ModalWrapper>
    </div>
  );
};

export default LeaveManagementTab;
