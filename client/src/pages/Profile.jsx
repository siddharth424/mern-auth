import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout');
      dispatch(signOut())
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md'>
      <h1 className='text-4xl font-extrabold text-center my-7 text-yellow-500'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover border-2 border-yellow-500 mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-500'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-gray-400'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-500'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-gray-700 text-gray-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-gray-700 text-gray-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-gray-700 text-gray-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-yellow-500 text-gray-900 rounded-lg p-3 uppercase hover:bg-yellow-600 disabled:opacity-50'
        >
          {loading ? 'Loading...' : 'Update Profile'}
        </button>
        <button
          type='button'
          onClick={handleDeleteAccount}
          className='bg-red-500 text-gray-100 rounded-lg p-3 uppercase hover:bg-red-600'
        >
          Delete Account
        </button>
        <button
          type='button'
          onClick={handleSignOut}
          className='bg-gray-500 text-gray-100 rounded-lg p-3 uppercase hover:bg-gray-600'
        >
          Sign Out
        </button>
      </form>
      <p className='text-green-500 mt-4'>
        {updateSuccess && 'Profile updated successfully!'}
      </p>
      <p className='text-red-500 mt-4'>
        {error && 'Something went wrong, please try again.'}
      </p>
    </div>
  );
}
