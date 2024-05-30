import { create } from 'zustand';

interface Follow {
  followingId: number;
  name: string;
  profilePicture: string;
}

interface Follower {
  followerId: number;
  name: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface Routine {
  id: number;
  title: string;
  description: string;
  frequency: string;
  nextRun: string;
}

interface Schedule {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface Member {
  id: number;
  email: string;
  nickName: string;
  introduce: string;
  profileUrl: string;
}

interface Friend {
  profilePicture: string;
  nickname: string;
  bio: string;
}

interface SignUpState {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  bio: string;
  profilePic: string;
  searchTerm: string;
  friends: Friend[];
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setNickname: (nickname: string) => void;
  setBio: (bio: string) => void;
  setProfilePic: (profilePic: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setFriends: (friends: Friend[]) => void;
  signUp: () => Promise<number>;
  uploadImage: (file: File, memberId: number) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

interface AppState {
  schedules: Schedule[];
  goals: Goal[];
  routines: Routine[];
  followings: Follow[];
  followers: Follower[];
  members: Member[];
  setSchedules: (schedules: Schedule[]) => void;
  setGoals: (goals: Goal[]) => void;
  setRoutines: (routines: Routine[]) => void;
  setFollowings: (followings: Follow[]) => void;
  setFollowers: (followers: Follower[]) => void;
  setMembers: (members: Member[]) => void;
  fetchSchedules: (memberId: number) => Promise<void>;
  fetchGoals: (memberId: number) => Promise<void>;
  fetchRoutines: (memberId: number) => Promise<void>;
  fetchFollowings: (memberId: number) => Promise<void>;
  fetchFollowers: (memberId: number) => Promise<void>;
  fetchMembers: (query: string) => Promise<void>;
}

interface ModalState {
  isFriendSearchOpen: boolean;
  setFriendSearchOpen: (isOpen: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (isOpen: boolean) => void;
  isEditModalOpen: boolean;
  setEditModalOpen: (isOpen: boolean) => void;
  memberId: number | null;
  setMemberId: (memberId: number) => void;
}

export const useStore = create<SignUpState & AppState & ModalState>((set, get) => ({
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  bio: '',
  profilePic: '',
  searchTerm: '',
  friends: [],
  schedules: [],
  goals: [],
  routines: [],
  followings: [],
  followers: [],
  members: [],
  isFriendSearchOpen: false,
  setFriendSearchOpen: (isOpen) => set({ isFriendSearchOpen: isOpen }),
  isSettingsOpen: false,
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  isEditModalOpen: false,
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
  memberId: null,
  setMemberId: (memberId) => set({ memberId }),

  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setNickname: (nickname) => set({ nickname }),
  setBio: (bio) => set({ bio }),
  setProfilePic: (profilePic) => set({ profilePic }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFriends: (friends) => set({ friends }),
  setSchedules: (schedules) => set({ schedules }),
  setGoals: (goals) => set({ goals }),
  setRoutines: (routines) => set({ routines }),
  setFollowings: (followings) => set({ followings }),
  setFollowers: (followers) => set({ followers }),
  setMembers: (members) => set({ members }),

  signUp: async (): Promise<number> => {
    const { email, password, bio, nickname } = get();
  
    const formData = {
      email,
      password,
      introduce: bio,
      nickName: nickname,
      memberPhoto: null, // 프로필 사진 URL을 null로 설정
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/members/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('회원가입 실패');
      }
  
      const data = await response.json();
      console.log('회원가입 성공:', data);
      set({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
        bio: '',
        profilePic: '',
      });
      return data.id; // memberId 반환
    } catch (error) {
      console.error('Error:', error);
      throw new Error('회원가입 실패');
    }
  },
  
  uploadImage: async (file: File, memberId: number): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}/profile`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Image upload failed: ${errorText}`);
      }
  
      console.log('Image upload successful');
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Image upload failed');
    }
  },
  
  login: async (email: string, password: string) => {
    const params = new URLSearchParams({
      email,
      password,
    });

    try {
      const response = await fetch(`http://localhost:8080/api/v1/members/login?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      console.log('로그인 성공:', data);
      set({ memberId: data.id }); // 로그인 성공 시 memberId 설정
    } catch (error) {
      console.error('Error:', error);
      alert('로그인 실패');
    }
  },

  fetchSchedules: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/calendar/${memberId}`);
      const data = await response.json();
      set({ schedules: data });
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  },

  fetchGoals: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/goal/${memberId}`);
      const data = await response.json();
      set({ goals: data });
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  },

  fetchRoutines: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/routines/${memberId}`);
      const data = await response.json();
      set({ routines: data });
    } catch (error) {
      console.error('Failed to fetch routines:', error);
    }
  },

  fetchFollowings: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/follow/${memberId}/following`);
      const data = await response.json();
      const followings = data.friends.map((friend: any) => ({
        followingId: friend.followingId,
        name: friend.name,
        profilePicture: friend.profilePicture || "default-profile-pic-url",
      }));
      set({ followings });
    } catch (error) {
      console.error('Failed to fetch followings:', error);
    }
  },

  fetchFollowers: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/follow/${memberId}/followers`);
      const data = await response.json();
      set({ followers: data.followers });
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  },

  fetchMembers: async (query: string) => {
    try {
      const response = await fetch(`/api/v1/members/search?nickNameOrEmail=${query}`);
      const data = await response.json();
      set({ members: data });
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  },
}));
