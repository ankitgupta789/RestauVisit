import { RiEditBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/operations/profile";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [prof, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    gender: "",
    contactNumber: "",
    address: "",
    about: "", // Added 'about' field to formData
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getProfile(user.email);
        console.log("Fetched profile:", result);
        setProfile(result);
        setFormData({
          gender: result?.gender || "",
          contactNumber: result?.contactNumber || "",
          address: result?.address || "",
          about: result?.about || "", // Initialize 'about' field if available
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
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
    try {
      const updatedProfile = await updateProfile(user.email, formData);
      console.log("Updated profile:", updatedProfile);
      setProfile(updatedProfile);
      // Optionally, display a success message or update state after successful update
    } catch (err) {
      console.error("Error updating profile:", err.message);
      // Optionally, display an error message or update state on error
    }
  };

  const handleDeleteAccount = async () => {
    // if (window.confirm("Are you sure you want to delete your account?")) {
    //   try {
    //     await dispatch(deleteProfile(user.email, token));
    //     navigate('/'); // Redirect to homepage after successful deletion
    //   } catch (err) {
    //     console.error("Error deleting account:", err.message);
    //     // Optionally, display an error message to the user
    //   }
    // }
  };

  return (
    <div className="container mx-auto p-4 h-screen overflow-auto">
      <div className="header mb-6">
        <h1 className="text-3xl font-medium text-richblack-5">My Profile</h1>
      </div>

      <div className="content space-y-10">
        <div className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-8">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold text-richblack-5">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-sm text-richblack-300">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <p className="mb-2 text-sm text-richblack-600">First Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Email</p>
              <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Gender</p>
              <p className="text-sm font-medium text-richblack-5">{prof?.gender || "Not provided"}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">{prof?.contactNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-600">Address</p>
              <p className="text-sm font-medium text-richblack-5">{prof?.address || "Not provided"}</p>
            </div>
            <div className="col-span-2">
              <p className="mb-2 text-sm text-richblack-600">About</p>
              <p className="text-sm font-medium text-richblack-5">{prof?.about || "Write something about yourself"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label htmlFor="gender" className="mb-2 text-sm text-richblack-600">Gender</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-richblack-600 rounded-md w-full"
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="mb-2 text-sm text-richblack-600">Phone Number</label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-richblack-600 rounded-md w-full"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="address" className="mb-2 text-sm text-richblack-600">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-richblack-600 rounded-md w-full"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="about" className="mb-2 text-sm text-richblack-600">About</label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="text-sm font-medium p-2 border border-richblack-600 rounded-md w-full h-20 resize-none"
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleSubmit} // Ensuring that handleSubmit is called
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between rounded-md border border-pink-700 bg-pink-900 p-8">
          <button
            className="flex items-center gap-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={() => navigate('/update-profile')}
          >
            <RiEditBoxLine className="text-xl" />
            Update Profile
          </button>
          <button
            className="flex items-center gap-x-2 bg-pink-700 text-white px-4 py-2 rounded-md hover:bg-pink-800"
            onClick={handleDeleteAccount}
          >
            <FiTrash2 className="text-3xl text-pink-200" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
