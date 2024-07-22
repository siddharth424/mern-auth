import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className='p-6 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md'>
      <h1 className='text-4xl text-center font-extrabold my-7 text-yellow-500'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          id='email'
          className='bg-gray-700 text-gray-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='bg-gray-700 text-gray-100 p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-yellow-500 text-gray-900 p-3 rounded-lg uppercase hover:bg-yellow-600 disabled:opacity-50'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5 text-gray-200'>
        <p>Dont Have an account?</p>
        <Link to='/sign-up'>
          <span className='text-yellow-500 hover:underline'>Sign up</span>
        </Link>
      </div>
      <p className='text-red-500 mt-5'>
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
  );
}
