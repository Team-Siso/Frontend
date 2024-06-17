import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

// 인터페이스 정의
interface Follow {
  followingId: number;
  name: string;
  profilePicture: string;
  isActive: boolean;
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
  uploadImage: (file: File, memberId: number) => Promise<string>;
  login: (email: string, password: string) => Promise<void>;
}

interface AppState {
  schedules: Schedule[];
  goals: Goal[];
  routines: Routine[];
  followings: Follow[];
  followers: Follower[];
  members: Member[];
  memberProfile: Member | null;
  setSchedules: (schedules: Schedule[]) => void;
  setGoals: (goals: Goal[]) => void;
  setRoutines: (routines: Routine[]) => void;
  setFollowings: (followings: Follow[]) => void;
  setFollowers: (followers: Follower[]) => void;
  setMembers: (members: Member[]) => void;
  setMemberProfile: (memberProfile: Member) => void;
  fetchSchedules: (memberId: number) => Promise<void>;
  fetchGoals: (memberId: number) => Promise<void>;
  fetchRoutines: (memberId: number) => Promise<void>;
  fetchFollowings: (memberId: number) => Promise<void>;
  fetchFollowers: (memberId: number) => Promise<void>;
  fetchMembers: (query: string) => Promise<void>;
  fetchMemberProfile: (memberId: number) => Promise<void>;
  updateNickname: (memberId: number, nickname: string) => Promise<void>;
  updateIntroduce: (memberId: number, introduce: string) => Promise<void>;
  updateProfilePicture: (memberId: number, file: File) => Promise<void>;
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

type StoreState = SignUpState & AppState & ModalState;

// localStorage를 PersistStorage 타입으로 변환하는 함수
const storage: PersistStorage<StoreState> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
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
      memberProfile: null,
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
      setMemberProfile: (memberProfile) => set({ memberProfile }),

      signUp: async () => {
        const { email, password, bio, nickname } = get();

        const formData = {
          email,
          password,
          introduce: bio,
          nickName: nickname,
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
          return data.id; // 회원가입 성공 시 memberId 반환
        } catch (error) {
          console.error('Error:', error);
          alert('회원가입 실패');
          throw error;
        }
      },

      uploadImage: async (file: File, memberId: number) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}/profile`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Image upload failed:', errorText);
            throw new Error('Image upload failed');
          }

          const text = await response.text(); // 텍스트로 응답을 받음
          console.log('Image upload successful:', text);
          return text; // 텍스트 응답 반환
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
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
          if (!response.ok) {
            throw new Error('Failed to fetch schedules');
          }
          const data = await response.json();
          set({ schedules: data });
        } catch (error) {
          console.error('Failed to fetch schedules:', error);
        }
      },

      fetchGoals: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/goal/${memberId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch goals');
          }
          const data = await response.json();
          set({ goals: data });
        } catch (error) {
          console.error('Failed to fetch goals:', error);
        }
      },

      fetchRoutines: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/routines/${memberId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch routines');
          }
          const data = await response.json();
          set({ routines: data });
        } catch (error) {
          console.error('Failed to fetch routines:', error);
        }
      },

      fetchFollowings: async (memberId: number) => {
        console.log(`Fetching followings for memberId: ${memberId}`); // 로그 추가
        try {
          const response = await fetch(`http://localhost:8080/api/v1/follow/${memberId}/following`);
          const contentType = response.headers.get("content-type");
      
          if (!response.ok) {
            throw new Error(`Failed to fetch followings: ${response.statusText}`);
          }
      
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            const followings = data.map((friend: any) => ({
              followingId: friend.followingId,
              name: friend.name,
              profilePicture: friend.memberPhoto || "default-profile-pic-url",
              isActive: friend.isActive // 추가
            }));
            set({ followings });
            console.log('Fetched followings:', followings); // 로그 추가
          } else {
            const text = await response.text();
            console.error('Expected JSON, got:', text);
            throw new Error('Received non-JSON response');
          }
        } catch (error) {
          console.error('Failed to fetch followings:', error);
        }
      }
      ,

      fetchFollowers: async (memberId: number) => {
        try {
          const response = await fetch(`/api/v1/follow/${memberId}/followers`);
          if (!response.ok) {
            throw new Error('Failed to fetch followers');
          }
          const data = await response.json();
          set({ followers: data.followers });
        } catch (error) {
          console.error('Failed to fetch followers:', error);
        }
      },

      fetchMembers: async (query: string) => {
        try {
          const response = await fetch(`/api/v1/members/search?nickNameOrEmail=${query}`);
          if (!response.ok) {
            throw new Error('Failed to fetch members');
          }
          const data = await response.json();
          set({ members: data });
        } catch (error) {
          console.error('Failed to fetch members:', error);
        }
      },

      fetchMemberProfile: async (memberId: number) => {
        console.log(`Fetching member profile for memberId: ${memberId}`); // 로그 추가
        try {
          const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}`);
          const contentType = response.headers.get("content-type");

          if (!response.ok) {
            throw new Error(`Failed to fetch member profile: ${response.statusText}`);
          }

          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log('API Response:', data); // API 응답 로그 추가
            const memberProfile = {
              id: memberId,
              email: data.email || '', // email을 빈 문자열로 초기화
              nickName: data.nickname,
              introduce: data.introduce,
              profileUrl: data.memberPhoto || "default-profile-pic-url"
            };
            set({ memberProfile });
            console.log('Fetched member profile:', memberProfile); // 로그 추가
          } else {
            const text = await response.text();
            console.error('Expected JSON, got:', text);
            throw new Error('Received non-JSON response');
          }
        } catch (error) {
          console.error('Failed to fetch member profile:', error);
        }
      },

      updateNickname: async (memberId: number, nickname: string) => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}/nickname`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nickname }),
          });

          if (!response.ok) {
            throw new Error('Failed to update nickname');
          }

          const data = await response.json();
          set((state) => ({
            memberProfile: {
              ...state.memberProfile,
              nickName: data.nickname,
            }
          }));
        } catch (error) {
          console.error('Failed to update nickname:', error);
        }
      },

      updateIntroduce: async (memberId: number, introduce: string) => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}/introduce`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ introduce }),
          });

          if (!response.ok) {
            throw new Error('Failed to update introduce');
          }

          const data = await response.json();
          set((state) => ({
            memberProfile: {
              ...state.memberProfile,
              introduce: data.introduce,
            }
          }));
        } catch (error) {
          console.error('Failed to update introduce:', error);
        }
      },

      updateProfilePicture: async (memberId: number, file: File) => {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`http://localhost:8080/api/v1/members/${memberId}/profile`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to update profile picture');
          }

          const text = await response.text(); // 텍스트 응답을 받음
          console.log('Profile picture update successful:', text);
          set((state) => ({
            memberProfile: {
              ...state.memberProfile,
              profileUrl: text, // 적절한 필드를 사용해야 함
            }
          }));
        } catch (error) {
          console.error('Failed to update profile picture:', error);
        }
      },
    }),
    {
      name: 'user-store', // 로컬 스토리지에 저장될 키 이름
      storage: storage, // localStorage를 persist storage로 변환하여 사용
    }
  )
);
