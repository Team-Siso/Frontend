import profileImage from '../assets/profile.png'

const ProfileSection = () => {
  return (
    <div className="flex items-center mb-6 text-left">
      <img src={profileImage} alt="Profile" className="rounded-full w-20 h-20 mr-5" />
      <div className="mr-10">
        <p className="text-lg font-bold">닉네임</p>
        <p className="text-sm text-gray-600">email@example.com</p>
        <p className="text-sm text-gray-500">자기소개를 입력하세요!</p>
      </div>
    </div>
  );
};

export default ProfileSection;
