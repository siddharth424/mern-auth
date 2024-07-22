import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-gray-800 shadow-lg'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/'>
          <h1 className='text-2xl font-extrabold text-yellow-500'>Auth App</h1>
        </Link>
        <ul className='flex items-center gap-6'>
          <Link to='/' className='text-gray-100 hover:text-yellow-500'>
            <li>Home</li>
          </Link>
          <Link to='/about' className='text-gray-100 hover:text-yellow-500'>
            <li>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt='profile'
                className='h-10 w-10 rounded-full object-cover border-2 border-yellow-500'
              />
            ) : (
              <li className='text-gray-100 hover:text-yellow-500'>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
