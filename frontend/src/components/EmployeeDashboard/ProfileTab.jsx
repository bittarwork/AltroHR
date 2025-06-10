import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services";
import { useToast, SimpleToastContainer } from "../ToastNotification";

// Icons
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit3,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiLock,
  FiClock,
  FiDollarSign,
  FiRefreshCw,
  FiCamera,
  FiCheck,
  FiUsers,
  FiBriefcase,
  FiTrash2,
  FiUpload,
  FiShield,
  FiInfo,
} from "react-icons/fi";

const ProfileTab = ({ user, darkMode, onDataChange }) => {
  const { user: authUser } = useAuth();
  const toast = useToast();

  // States
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const response = await userService.getProfile();
      if (response.success) {
        setProfileData(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
        });
      } else {
        toast.error("فشل في تحميل البيانات الشخصية");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.updateProfile(formData);
      if (response.success) {
        setProfileData({ ...profileData, ...formData });
        setEditingSection(null);
        toast.success("تم تحديث البيانات بنجاح");
        onDataChange?.();
      } else {
        toast.error(response.error || "فشل في تحديث البيانات");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword) {
      toast.error("كلمة المرور الحالية مطلوبة");
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    try {
      setLoading(true);
      const response = await userService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setEditingSection(null);
        toast.success("تم تغيير كلمة المرور بنجاح");
      } else {
        toast.error(response.error || "فشل في تغيير كلمة المرور");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // رفع الصورة الشخصية
  const handleImageUpload = async (file) => {
    if (!file) return;

    const validation = userService.validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setUploadingImage(true);
    try {
      const response = await userService.uploadProfileImage(file);
      if (response.success) {
        setProfileData((prev) => ({
          ...prev,
          profileImage: response.data.profileImage,
        }));
        toast.success("تم رفع الصورة بنجاح");
        onDataChange?.();
      } else {
        toast.error(response.error || "فشل في رفع الصورة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      setUploadingImage(true);
      const response = await userService.deleteProfileImage();
      if (response.success) {
        setProfileData((prev) => ({
          ...prev,
          profileImage: null,
        }));
        toast.success("تم حذف الصورة بنجاح");
        onDataChange?.();
      } else {
        toast.error(response.error || "فشل في حذف الصورة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <FiRefreshCw
            className={`animate-spin text-3xl ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SimpleToastContainer />

      {/* Header Section */}
      <div
        className={`relative overflow-hidden rounded-3xl ${
          darkMode
            ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800"
            : "bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        } p-8 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-6 space-x-reverse">
            <ProfileImageUpload
              profileData={profileData}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              uploadingImage={uploadingImage}
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              darkMode={darkMode}
            />

            <div className="flex-1">
              <h1
                className={`text-3xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {profileData?.name || "المستخدم"}
              </h1>
              <p
                className={`text-lg mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {profileData?.position || "الموظف"} •{" "}
                {profileData?.department?.name || "قسم غير محدد"}
              </p>

              <div className="flex flex-wrap gap-4">
                <div
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg ${
                    darkMode ? "bg-gray-700/50" : "bg-white/80"
                  }`}
                >
                  <FiMail
                    className={`text-sm ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {profileData?.email || "غير محدد"}
                  </span>
                </div>

                {profileData?.phone && (
                  <div
                    className={`flex items-center space-x-2 space-x-reverse px-3 py-1 rounded-lg ${
                      darkMode ? "bg-gray-700/50" : "bg-white/80"
                    }`}
                  >
                    <FiPhone
                      className={`text-sm ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {profileData.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <SectionCard
          title="المعلومات الشخصية"
          icon={FiUser}
          darkMode={darkMode}
        >
          <PersonalInfoSection
            profileData={profileData}
            formData={formData}
            editingSection={editingSection}
            onEdit={() => handleEditClick("personal")}
            onCancel={handleCancelEdit}
            onSave={handleSaveProfile}
            onInputChange={handleInputChange}
            loading={loading}
            darkMode={darkMode}
          />
        </SectionCard>

        {/* Job Information */}
        <SectionCard
          title="معلومات العمل"
          icon={FiBriefcase}
          darkMode={darkMode}
        >
          <JobInfoSection profileData={profileData} darkMode={darkMode} />
        </SectionCard>

        {/* Account Information */}
        <SectionCard title="معلومات الحساب" icon={FiShield} darkMode={darkMode}>
          <AccountInfoSection profileData={profileData} darkMode={darkMode} />
        </SectionCard>

        {/* Password Change */}
        <SectionCard
          title="تغيير كلمة المرور"
          icon={FiLock}
          darkMode={darkMode}
        >
          <PasswordSection
            passwordData={passwordData}
            showPasswords={showPasswords}
            editingSection={editingSection}
            onEdit={() => handleEditClick("password")}
            onCancel={handleCancelEdit}
            onSave={handleChangePassword}
            onPasswordChange={handlePasswordChange}
            onToggleVisibility={togglePasswordVisibility}
            loading={loading}
            darkMode={darkMode}
          />
        </SectionCard>
      </div>
    </div>
  );
};

// مكون رفع الصورة الشخصية
const ProfileImageUpload = ({
  profileData,
  onImageUpload,
  onImageDelete,
  uploadingImage,
  dragActive,
  onDrag,
  onDrop,
  darkMode,
}) => {
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative group">
      <div
        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-500/10"
            : darkMode
            ? "border-gray-600 group-hover:border-gray-500"
            : "border-gray-300 group-hover:border-gray-400"
        }`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
      >
        {profileData?.profileImage ? (
          <img
            src={profileData.profileImage}
            alt="الصورة الشخصية"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <FiUser
              className={`text-4xl ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        )}

        {/* Overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            darkMode ? "bg-black/50" : "bg-black/40"
          }`}
        >
          {uploadingImage ? (
            <FiRefreshCw className="text-white text-2xl animate-spin" />
          ) : (
            <FiCamera className="text-white text-2xl" />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-2 -left-2 flex space-x-2 space-x-reverse">
        {/* Upload Button */}
        <label
          className={`p-2 rounded-full cursor-pointer transition-all duration-200 ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } shadow-lg hover:scale-110`}
        >
          <FiUpload className="text-sm" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={uploadingImage}
          />
        </label>

        {/* Delete Button */}
        {profileData?.profileImage && (
          <button
            onClick={onImageDelete}
            disabled={uploadingImage}
            className={`p-2 rounded-full transition-all duration-200 ${
              darkMode
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            } shadow-lg hover:scale-110 disabled:opacity-50`}
          >
            <FiTrash2 className="text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

// مكون قسم المعلومات الشخصية
const PersonalInfoSection = ({
  profileData,
  formData,
  editingSection,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
  loading,
  darkMode,
}) => {
  const isEditing = editingSection === "personal";

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          إدارة معلوماتك الشخصية
        </p>

        {!isEditing ? (
          <button
            onClick={onEdit}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <FiEdit3 className="text-sm" />
            <span>تعديل</span>
          </button>
        ) : (
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={onCancel}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              <FiX className="text-sm" />
              <span>إلغاء</span>
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } disabled:opacity-50`}
            >
              {loading ? (
                <FiRefreshCw className="text-sm animate-spin" />
              ) : (
                <FiSave className="text-sm" />
              )}
              <span>حفظ</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <FormField
          icon={FiUser}
          label="الاسم الكامل"
          value={isEditing ? formData.name : profileData?.name}
          isEditing={isEditing}
          onChange={(value) => onInputChange("name", value)}
          darkMode={darkMode}
        />

        <FormField
          icon={FiMail}
          label="البريد الإلكتروني"
          value={isEditing ? formData.email : profileData?.email}
          isEditing={isEditing}
          onChange={(value) => onInputChange("email", value)}
          type="email"
          darkMode={darkMode}
        />

        <FormField
          icon={FiPhone}
          label="رقم الهاتف"
          value={isEditing ? formData.phone : profileData?.phone}
          isEditing={isEditing}
          onChange={(value) => onInputChange("phone", value)}
          type="tel"
          darkMode={darkMode}
        />

        <FormField
          icon={FiMapPin}
          label="العنوان"
          value={isEditing ? formData.address : profileData?.address}
          isEditing={isEditing}
          onChange={(value) => onInputChange("address", value)}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

// مكون معلومات العمل
const JobInfoSection = ({ profileData, darkMode }) => {
  return (
    <div className="space-y-6">
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        معلومات الوظيفة والقسم
      </p>

      <div className="space-y-4">
        <InfoItem
          icon={FiBriefcase}
          label="المنصب"
          value={profileData?.position || "غير محدد"}
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiUsers}
          label="القسم"
          value={profileData?.department?.name || "غير محدد"}
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiCalendar}
          label="تاريخ التوظيف"
          value={
            profileData?.hireDate
              ? new Date(profileData.hireDate).toLocaleDateString("ar-SA")
              : "غير محدد"
          }
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiDollarSign}
          label="الراتب"
          value={
            profileData?.salary ? `${profileData.salary} ريال` : "غير محدد"
          }
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

// مكون معلومات الحساب
const AccountInfoSection = ({ profileData, darkMode }) => {
  return (
    <div className="space-y-6">
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        معلومات الحساب والدخول
      </p>

      <div className="space-y-4">
        <InfoItem
          icon={FiUser}
          label="اسم المستخدم"
          value={profileData?.username || profileData?.email || "غير محدد"}
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiShield}
          label="الدور"
          value={profileData?.role === "admin" ? "مدير" : "موظف"}
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiCalendar}
          label="تاريخ إنشاء الحساب"
          value={
            profileData?.createdAt
              ? new Date(profileData.createdAt).toLocaleDateString("ar-SA")
              : "غير محدد"
          }
          darkMode={darkMode}
        />

        <InfoItem
          icon={FiClock}
          label="آخر تحديث"
          value={
            profileData?.updatedAt
              ? new Date(profileData.updatedAt).toLocaleDateString("ar-SA")
              : "غير محدد"
          }
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

// مكون تغيير كلمة المرور
const PasswordSection = ({
  passwordData,
  showPasswords,
  editingSection,
  onEdit,
  onCancel,
  onSave,
  onPasswordChange,
  onToggleVisibility,
  loading,
  darkMode,
}) => {
  const isEditing = editingSection === "password";

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          تغيير كلمة مرور الحساب
        </p>

        {!isEditing ? (
          <button
            onClick={onEdit}
            className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            <FiLock className="text-sm" />
            <span>تغيير كلمة المرور</span>
          </button>
        ) : (
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={onCancel}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              <FiX className="text-sm" />
              <span>إلغاء</span>
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              } disabled:opacity-50`}
            >
              {loading ? (
                <FiRefreshCw className="text-sm animate-spin" />
              ) : (
                <FiSave className="text-sm" />
              )}
              <span>حفظ</span>
            </button>
          </div>
        )}
      </div>

      {/* Password Fields */}
      {isEditing ? (
        <div className="space-y-4">
          <PasswordField
            label="كلمة المرور الحالية"
            value={passwordData.oldPassword}
            showPassword={showPasswords.old}
            onChange={(value) => onPasswordChange("oldPassword", value)}
            onToggleVisibility={() => onToggleVisibility("old")}
            darkMode={darkMode}
          />

          <PasswordField
            label="كلمة المرور الجديدة"
            value={passwordData.newPassword}
            showPassword={showPasswords.new}
            onChange={(value) => onPasswordChange("newPassword", value)}
            onToggleVisibility={() => onToggleVisibility("new")}
            darkMode={darkMode}
          />

          <PasswordField
            label="تأكيد كلمة المرور الجديدة"
            value={passwordData.confirmPassword}
            showPassword={showPasswords.confirm}
            onChange={(value) => onPasswordChange("confirmPassword", value)}
            onToggleVisibility={() => onToggleVisibility("confirm")}
            darkMode={darkMode}
          />

          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-blue-900/20 border border-blue-700/50"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-start space-x-2 space-x-reverse">
              <FiInfo
                className={`text-sm mt-0.5 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <div
                className={`text-sm ${
                  darkMode ? "text-blue-300" : "text-blue-700"
                }`}
              >
                <p className="font-medium mb-1">متطلبات كلمة المرور:</p>
                <ul className="text-xs space-y-1">
                  <li>• يجب أن تكون 6 أحرف على الأقل</li>
                  <li>• يُفضل استخدام مزيج من الأحرف والأرقام</li>
                  <li>• تجنب استخدام معلومات شخصية</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 text-center rounded-lg ${
            darkMode ? "bg-gray-700/50" : "bg-gray-100"
          }`}
        >
          <FiLock
            className={`text-3xl mx-auto mb-3 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            اضغط على "تغيير كلمة المرور" لتعديل كلمة مرور حسابك
          </p>
        </div>
      )}
    </div>
  );
};

// مكون بطاقة القسم
const SectionCard = ({ title, icon: Icon, children, darkMode }) => (
  <div
    className={`rounded-2xl border transition-all duration-200 hover:shadow-lg ${
      darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}
  >
    <div
      className={`px-6 py-4 border-b ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="flex items-center space-x-3 space-x-reverse">
        <div
          className={`p-2 rounded-lg ${
            darkMode ? "bg-blue-900/30" : "bg-blue-50"
          }`}
        >
          <Icon
            className={`text-lg ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </div>
        <h3
          className={`text-lg font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// مكون عنصر المعلومات
const InfoItem = ({ icon: Icon, label, value, darkMode }) => (
  <div className="flex items-center space-x-3 space-x-reverse">
    <div
      className={`p-2 rounded-lg ${
        darkMode ? "bg-gray-700/50" : "bg-gray-100"
      }`}
    >
      <Icon
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      />
    </div>
    <div className="flex-1">
      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
        {value || "غير محدد"}
      </p>
    </div>
  </div>
);

// مكون حقل النموذج
const FormField = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  darkMode,
}) => (
  <div className="flex items-center space-x-3 space-x-reverse">
    <div
      className={`p-2 rounded-lg ${
        darkMode ? "bg-gray-700/50" : "bg-gray-100"
      }`}
    >
      <Icon
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
      />
    </div>
    <div className="flex-1">
      <p
        className={`text-sm mb-1 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        />
      ) : (
        <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>
          {value || "غير محدد"}
        </p>
      )}
    </div>
  </div>
);

// مكون حقل كلمة المرور
const PasswordField = ({
  label,
  value,
  showPassword,
  onChange,
  onToggleVisibility,
  darkMode,
}) => (
  <div>
    <label
      className={`block text-sm mb-2 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border transition-colors pr-10 ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          darkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-600"
        }`}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  </div>
);

export default ProfileTab;
