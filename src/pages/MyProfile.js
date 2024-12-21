import { RiEditBoxLine } from "react-icons/ri";
import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/operations/profile";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [prof, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);  // State for save loading
  const [formData, setFormData] = useState({
    gender: "",
    contactNumber: "",
    address: "",
    about: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getProfile(user.email);
        setProfile(result);
        setFormData({
          gender: result?.gender || "",
          contactNumber: result?.contactNumber || "",
          address: result?.address || "",
          about: result?.about || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setLoading(false);
      }
    };

    if (user && user.email) {
      fetchProfile();
    }
  }, [user.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true); // Set loading to true during save
    try {
      const updatedProfile = await updateProfile(user.email, formData);
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error updating profile:", err.message);
    } finally {
      setLoadingSave(false); // Set loading to false after save is done
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary preset

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvlvjwx5t/image/upload", // Replace with your Cloudinary details
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        if (data.secure_url) {
          const updatedProfile = { ...prof, image: data.secure_url };
          await updateProfile(user.email, updatedProfile);
          setProfile(updatedProfile); // Update local state
        }
      } catch (err) {
        console.error("Error uploading image:", err.message);
      } finally {
        setLoadingImage(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen overflow-auto">
      <div className="header mb-6">
        <h1 className="text-3xl font-medium text-black">My Profile</h1>
      </div>

      <div className="content space-y-10">
        <div className="flex items-center rounded-md border border-richblack-700 bg-white p-8">
          {/* Profile image and Name/Email */}
          <div className="flex items-center gap-x-6">
            <div className="flex flex-col items-center gap-y-2">
              {loadingImage ? (
                <div className="w-[78px] h-[78px] rounded-full flex items-center justify-center bg-gray-300">
                  <svg
                    className="w-6 h-6 text-gray-700 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                </div>
              ) : prof?.image ? (
                <div className="relative">
                  <img
                    src={prof.image}
                    alt={`profile-${prof?.firstName || user?.firstName}`}
                    className="aspect-square w-[78px] rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-[78px] h-[78px] rounded-full bg-gray-300 cursor-pointer">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <RiEditBoxLine className="w-6 h-6 text-gray-700" />
                    <p className="text-xs text-gray-700 mt-1">Add Photo</p>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </label>
                </div>
              )}
              <label
                htmlFor="image-upload"
                className="text-blue-500 text-sm cursor-pointer"
              >
                Change Picture
              </label>
              <input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
              />
            </div>
          </div>

          {/* Profile Name and Email */}
          <div className="flex flex-col ml-6">
            <div className="text-lg font-medium text-black">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>

        <div className="rounded-md border border-richblack-700 bg-white p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
          >
            {/* Form fields */}
            <div>
              <label
                htmlFor="gender"
                className="mb-2 text-sm text-black"
              >
                Gender
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-black rounded-md w-full"
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="mb-2 text-sm text-black"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-black rounded-md w-full"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="address"
                className="mb-2 text-sm text-black"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-black rounded-md w-full"
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="about"
                className="mb-2 text-sm text-black"
              >
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-black rounded-md w-full h-20 resize-none"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {loadingSave ? (
                  <svg
                    className="w-6 h-6 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
