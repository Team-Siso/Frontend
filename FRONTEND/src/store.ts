import { create, StateCreator } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import DefaultImage from "@/assets/profile.png";
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
  profilePicture: string;
  isActive: boolean;
}

interface Goal {
  id: number;
  title: string;
  progress: number;
  completed: boolean;
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
  content: string;
  checkStatus: number;
  thisDay: string;
  startTime: string;
  endTime: string;
  completed: boolean;
}

interface Member {
  id: number;
  email: string;
  nickName: string;
  introduce: string;
  profileUrl: string;
}

export interface Friend {
  id: string;
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
  setRoutines: (routines: Routine[]) => void;
  setMemberProfile: (memberProfile: Member) => void;
  setMemberId: (memberId: number) => void;
  setSchedules: (schedules: Schedule[]) => void;
  // setScheduleId: (scheduleId: number) => void;
  setGoal: (title: string) => Promise<void>; // 추가된 함수
  toggleGoalCompletion: (id: number) => void; // 추가된 함수
  deleteGoal: (id: number) => void; // 추가된 함수
  updateProgress: (goalId: number, progress: number) => Promise<void>; // 추가된 함수
  setFollowings: (followings: Follow[]) => void;
  setFollowers: (followers: Follower[]) => void;
  setMembers: (members: Member[]) => void;
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
  addTodo: (memberId: number, newTodo: Omit<Schedule, "id">) => Promise<void>;
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

interface StoreState extends SignUpState, AppState, ModalState {
  resetState: () => void;
}

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
  },
};

// Zustand 상태 생성기
const stateCreator: StateCreator<StoreState> = (set, get) => ({
  email: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  bio: "",
  profilePic: "",
  searchTerm: "",
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
  scheduleId: null,

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

  resetState: () => {
    set({
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      bio: "",
      profilePic: "",
      searchTerm: "",
      friends: [],
      schedules: [],
      goals: [],
      routines: [],
      followings: [],
      followers: [],
      members: [],
      memberProfile: null,
      isFriendSearchOpen: false,
      isSettingsOpen: false,
      isEditModalOpen: false,
      memberId: null,
    });
  },

  signUp: async () => {
    const { email, password, bio, nickname, resetState } = get();

    const formData = {
      email,
      password,
      introduce: bio,
      nickName: nickname,
    };

    try {
      const response = await fetch("http://siiso.site:8080/api/v1/members/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      const data = await response.json();
      console.log("회원가입 성공:", data);
      resetState();
      set({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        bio: "",
        profilePic: "",
        memberId: data.id,
      });
      localStorage.setItem("memberId", data.id.toString());
      return data.id;
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 실패");
      throw error;
    }
  },

  // 이미지 업로드
  uploadImage: async (file: File, memberId: number) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}/profile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image upload failed:", errorText);
        throw new Error("Image upload failed");
      }

      const text = await response.text(); // 텍스트로 응답을 받음
      console.log("Image upload successful:", text);
      return text; // 텍스트 응답 반환
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
  // 로그인
  login: async (email: string, password: string) => {
    const { resetState } = get();

    const params = new URLSearchParams({
      email,
      password,
    });

    try {
      const response = await fetch(
        `http://siiso.site:8080/api/v1/members/login?${params.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      console.log("로그인 성공:", data);
      resetState(); // 상태 초기화
      set({ memberId: data.id, email: "", password: "" }); // 로그인 성공 시 memberId 설정
      localStorage.setItem("memberId", data.id.toString()); // 로컬스토리지에 멤버 아이디 저장
    } catch (error) {
      console.error("Error:", error);
      alert("아이디와 비밀번호를 확인해주세요");
    }
  },

  fetchSchedules: async (memberId: number): Promise<void> => {
    try {
      const response = await fetch(`/api/v1/schedules/${memberId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch schedules(사용자의 모든 일정조회): ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Expected JSON response");
      }

      const data: Schedule[] = await response.json();
      set({ schedules: data || [] }); // data가 undefined일 경우 빈 배열 설정
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
      set({ schedules: [] }); // 에러 발생 시 빈 배열 설정
    }
  },

  fetchGoals: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/goals/${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch goals(사용자의 모든 goal 조회)");
      }
      const data = await response.json();
      set({ goals: data });
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  },

  fetchRoutines: async (memberId: number) => {
    try {
      const response = await fetch(`/api/v1/routines/${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch routines");
      }
      const data = await response.json();
      set({ routines: data });
    } catch (error) {
      console.error("Failed to fetch routines:", error);
    }
  },

  fetchFollowings: async (memberId: number) => {
    console.log(`Fetching followings for memberId: ${memberId}`); // 로그 추가
    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/follows/${memberId}/following`);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`Failed to fetch followings: ${response.statusText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const followings = data.map((friend: any) => ({
          followingId: friend.followingId,
          name: friend.name,
          profilePicture: friend.memberPhoto || DefaultImage,
          isActive: friend.isActive, // 추가
        }));
        set({ followings });
        console.log("Fetched followings:", followings); // 로그 추가
      } else {
        const text = await response.text();
        console.error("Expected JSON, got:", text);
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Failed to fetch followings:", error);
    }
  },

  fetchFollowers: async (memberId: number) => {
    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/follows/${memberId}/followers`);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error("Failed to fetch followers");
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const followers = data.map((friend: any) => ({
          followingId: friend.followingId,
          name: friend.name,
          profilePicture: friend.memberPhoto || DefaultImage,
          isActive: friend.isActive, // 추가
        }));
        set({ followers });
        console.log("Fetched followers:", followers); // 로그 추가
      } else {
        const text = await response.text();
        console.error("Expected JSON, got:", text);
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    }
  },

  fetchMembers: async (query: string) => {
    try {
      const response = await fetch(
        `http://siiso.site:8080/api/v1/members/search?nickNameOrEmail=${query}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const data = await response.json();
      set({ members: data });
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  },

  fetchMemberProfile: async (memberId: number) => {
    console.log(`Fetching member profile for memberId: ${memberId}`); // 로그 추가
    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}`);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`Failed to fetch member profile: ${response.statusText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("API Response:", data); // API 응답 로그 추가
        const memberProfile = {
          id: memberId,
          email: data.email || "", // email을 빈 문자열로 초기화
          nickName: data.nickname,
          introduce: data.introduce,
          profileUrl: data.memberPhoto || DefaultImage,
        };
        set({ memberProfile });
        console.log("Fetched member profile:", memberProfile); // 로그 추가
      } else {
        const text = await response.text();
        console.error("Expected JSON, got:", text);
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Failed to fetch member profile:", error);
    }
  },

  addTodo: async (memberId: number, newTodo: Omit<Schedule, "id">) => {
    try {
      const response = await fetch(`/api/v1/member/${memberId}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await response.json();
      set((state) => ({
        schedules: [...state.schedules, { ...data, id: data.id }],
      }));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add todo");
    }
  },

  setGoal: async (title: string) => {
    const { memberId } = get();
    if (memberId !== null) {
      try {
        const response = await fetch(`http://siiso.site:8080/api/v1/goals/${memberId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, progress: 0, completed: false }),
        });

        if (!response.ok) {
          throw new Error("Failed to set goal");
        }

        const data = await response.json();
        set((state) => ({ goals: [...state.goals, data] }));
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to set goal");
      }
    }
  },

  toggleGoalCompletion: (id: number) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
  },

  deleteGoal: (id: number) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },

  updateNickname: async (memberId: number, nickname: string) => {
    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}/nickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        throw new Error("Failed to update nickname");
      }

      const data = await response.json();
      set((state) => ({
        memberProfile: {
          ...state.memberProfile,
          nickName: data.nickname,
        },
      }));
    } catch (error) {
      console.error("Failed to update nickname:", error);
    }
  },

  updateProgress: async (goalId: number, progress: number) => {
    const { memberId } = get();
    if (memberId !== null) {
      try {
        const response = await fetch(
          `http://siiso.site:8080/api/v1/member/${memberId}/goal/${goalId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ progress }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update progress");
        }

        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === goalId ? { ...goal, progress } : goal)),
        }));
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to update progress");
      }
    }
  },

  updateIntroduce: async (memberId: number, introduce: string) => {
    try {
      const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}/introduce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ introduce }),
      });

      if (!response.ok) {
        throw new Error("Failed to update introduce");
      }

      const data = await response.json();
      set((state) => ({
        memberProfile: {
          ...state.memberProfile,
          introduce: data.introduce,
        },
      }));
    } catch (error) {
      console.error("Failed to update introduce:", error);
    }
  },

  updateProfilePicture: async (memberId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`http://siiso.site:8080/api/v1/members/${memberId}/profile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile picture");
      }

      const text = await response.text(); // 텍스트 응답을 받음
      console.log("Profile picture update successful:", text);
      set((state) => ({
        memberProfile: {
          ...state.memberProfile,
          profileUrl: text, // 적절한 필드를 사용해야 함
        },
      }));
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  },
});

// Zustand store 생성
export const useStore = create<StoreState>()(
  persist(stateCreator, {
    name: "user-store", // 로컬 스토리지에 저장될 키 이름
    storage: storage, // localStorage를 persist storage로 변환하여 사용
  })
);
