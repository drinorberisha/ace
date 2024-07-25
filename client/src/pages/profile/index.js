
import Navigation from '@/components/common/navigation';
import UserProfile from '@/components/user/userProfile';
import Newnav from '@/components/common/newnav';

function Profile() {
  return (
    <div>
      <Newnav/>
      {/* <Navigation /> */}
      <div className="profile-container">
        <h1>MY PROFILE</h1>
        <UserProfile />



      </div>
    </div>
  );
}

export default Profile;

