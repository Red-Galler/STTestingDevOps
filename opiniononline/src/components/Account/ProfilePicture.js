import { Avatar } from '@material-tailwind/react';
import { useSelector } from 'react-redux';

function ProfilePicture({size}) {

  const imageUrl = useSelector(state => state.surveys.profilePictureLoggedInUser);

  return (
    
      <Avatar
          variant="circular"
          size={size}
          alt="avatar"
          className="cursor-pointer"
          src={imageUrl}
        />


  );
}

export default ProfilePicture;