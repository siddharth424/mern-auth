import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(true);
        return;
      }
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div className='p-6 max-w-lg mx-auto bg-gray-800 rounded-lg shadow-md'>
      <h1 className='text-4xl text-center font-extrabold my-7 text-yellow-500'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          id='username'
          className='bg-gray-700 text-gray-100 p-3 rounded-lg'
          onChange={handleChange}
        />
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5 text-gray-200'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-yellow-500 hover:underline'>Sign in</span>
        </Link>
      </div>
      <p className='text-red-500 mt-5'>{error && 'Something went wrong!'}</p>
    </div>
  );
}
