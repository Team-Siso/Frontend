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

// ---------------------------
// SignUpState
// ---------------------------
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
// ---------------------------
// AppState
// ---------------------------
interface AppState {
  schedules: Schedule[];
  goals: Goal[];
  routines: Routine[];
  followings: Follow[];
  followers: Follower[];
  members: Member[];
  memberProfile: Member | null;

  // ★ 추가: 캘린더에서 클릭된 날짜("YYYY-MM-DD") 저장
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  setRoutines: (routines: Routine[]) => void;
  setMemberProfile: (memberProfile: Member) => void;
  setMemberId: (memberId: number) => void;
  setSchedules: (schedules: Schedule[]) => void;

  setGoal: (title: string) => Promise<void>;
  toggleGoalCompletion: (id: number) => void;
  deleteGoal: (id: number) => void;
  updateProgress: (goalId: number, progress: number) => Promise<void>;
  setFollowings: (followings: Follow[]) => void;
  setFollowers: (followers: Follower[]) => void;
  setMembers: (members: Member[]) => void;
  // 기존: 전체 스케줄 조회
  fetchSchedules: (memberId: number) => Promise<void>;

  // ★ 추가: 특정 날짜 스케줄 조회
  fetchSchedulesByDate: (memberId: number, dateString: string) => Promise<void>;
  fetchGoals: (memberId: number) => Promise<void>;
  fetchRoutines: (memberId: number) => Promise<void>;
  fetchFollowings: (memberId: number) => Promise<void>;
  fetchFollowers: (memberId: number) => Promise<void>;
  fetchMembers: (query: string) => Promise<void>;
  fetchMemberProfile: (memberId: number) => Promise<void>;
  updateNickname: (memberId: number, nickname: string) => Promise<void>;
  updateIntroduce: (memberId: number, introduce: string) => Promise<void>;
  updateProfilePicture: (memberId: number, file: File) => Promise<void>;
  addTodo: (memberId: number, newTodo: Omit<Schedule, "id">) => Promise<Schedule | void>;
}
// ---------------------------
// ModalState
// ---------------------------
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

// ---------------------------
// 최종 StoreState
// ---------------------------
interface StoreState extends SignUpState, AppState, ModalState {
  resetState: () => void;
}

// localStorage를 PersistStorage 타입으로 변환
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
  // ★ 추가
  selectedDate: null,

  // ---------------------------
  // ModalState 초기값
  // ---------------------------
  isFriendSearchOpen: false,
  isSettingsOpen: false,
  isEditModalOpen: false,
  memberId: null,
  // scheduleId: null,

  // ---------------------------
  // setter들
  // ---------------------------
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setNickname: (nickname) => set({ nickname }),
  setBio: (bio) => set({ bio }),
  setProfilePic: (profilePic) => set({ profilePic }),
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setFriends: (friends) => set({ friends }),

  setMemberId: (memberId) => {
    console.log("[store] setMemberId:", memberId);
    set({ memberId });
  },
  setFriendSearchOpen: (isOpen) => set({ isFriendSearchOpen: isOpen }),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
  setEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),

  setSchedules: (schedules) => set({ schedules }),
  setGoals: (goals) => set({ goals }),
  setRoutines: (routines) => set({ routines }),
  setFollowings: (followings) => set({ followings }),
  setFollowers: (followers) => set({ followers }),
  setMembers: (members) => set({ members }),
  setMemberProfile: (memberProfile) => set({ memberProfile }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  // ---------------------------
  // resetState
  // ---------------------------
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

      selectedDate: null,

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
      const response = await fetch("https://siiso.site/api/v1/members/signup", {
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
        // email: "",
        // password: "",
        // confirmPassword: "",
        // nickname: "",
        // bio: "",
        // profilePic: "",
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
      const response = await fetch(`https://siiso.site/api/v1/members/${memberId}/profile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Image upload failed:", errorText);
        throw new Error("Image upload failed");
      }

      const text = await response.text();
      console.log("Image upload successful:", text);
      return text;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // ---------------------------
  // 로그인
  // ---------------------------
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
      console.log(response.status);
      if (!response.ok) {
        if (response.status === 404) {
          alert("아이디와 비밀번호를 확인해주세요!!");
        } else {
          alert("로그인에 실패했습니다.");
        }
        throw new Error("로그인 실패");
      }
      const data = await response.json();
      console.log("로그인 성공:", data);
      resetState(); // 상태 초기화
      set({ memberId: data.id, email: "", password: "" }); // 로그인 성공 시 memberId 설정
      localStorage.setItem("memberId", data.id.toString()); // 로컬스토리지에 멤버 아이디 저장
    } catch (error) {
      console.error("Error:", error);
      throw error; // 예외를 상위에서 처리
    }
  },

  // ---------------------------
  // 스케줄 조회 (전체)
  // ---------------------------
  fetchSchedules: async (memberId: number): Promise<void> => {
    console.log("[fetchSchedules] Start => memberId:", memberId);
    try {
      const response = await fetch(`https://siiso.site/api/v1/schedules/${memberId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch schedules(사용자의 모든 일정 조회): ${response.statusText}`
        );
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Expected JSON response");
      }
      const data: Schedule[] = await response.json();
      console.log("[fetchSchedules] Success => data:", data);

      set({ schedules: data || [] });
    } catch (error) {
      console.error("[fetchSchedules] Error:", error);
      set({ schedules: [] });
    }
  },

  // ---------------------------
  // ★ 특정 날짜 스케줄 조회
  // ---------------------------
  fetchSchedulesByDate: async (memberId: number, dateString: string): Promise<void> => {
    console.log("[fetchSchedulesByDate] Start =>", { memberId, dateString });
    try {
      const response = await fetch(`https://siiso.site/api/v1/schedules/${memberId}/${dateString}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[fetchSchedulesByDate] Fail => date(${dateString}):`, errorText);
        throw new Error(errorText || "알 수 없는 오류");
      }
      const data: Schedule[] = await response.json();
      console.log(`[fetchSchedulesByDate] Success => date(${dateString}):`, data);

      // e.g. data.forEach((sch) => sch.startTime = removeOffsetIfExists(sch.startTime));

      set({ schedules: data || [] });
    } catch (error) {
      console.error("[fetchSchedulesByDate] Error:", error);
      set({ schedules: [] });
    }
  },

  // ---------------------------
  // goal 조회
  // ---------------------------
  fetchGoals: async (memberId: number) => {
    try {
      const response = await fetch(`https://siiso.site/api/v1/goals/${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch goals(사용자의 모든 goal 조회)");
      }
      const data = await response.json();
      set({ goals: data });
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  },

  // ---------------------------
  // 루틴 조회
  // ---------------------------
  fetchRoutines: async (memberId: number) => {
    try {
      const response = await fetch(`https://siiso.site/api/v1/routines/${memberId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch routines");
      }
      const data = await response.json();
      set({ routines: data });
    } catch (error) {
      console.error("Failed to fetch routines:", error);
    }
  },

  // ---------------------------
  // 팔로잉 조회
  // ---------------------------
  fetchFollowings: async (memberId: number) => {
    console.log(`Fetching followings for memberId: ${memberId}`); // 로그 추가
    try {
      const response = await fetch(`https://siiso.site/api/v1/follows/${memberId}/following`);
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
          isActive: friend.isActive,
        }));
        set({ followings });
        console.log("Fetched followings:", followings);
      } else {
        const text = await response.text();
        console.error("Expected JSON, got:", text);
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Failed to fetch followings:", error);
    }
  },

  // ---------------------------
  // 팔로워 조회
  // ---------------------------
  fetchFollowers: async (memberId: number) => {
    try {
      const response = await fetch(`http://siiso.site/api/v1/follows/${memberId}/followers`);
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

  // ---------------------------
  // 멤버 검색
  // ---------------------------
  fetchMembers: async (query: string) => {
    try {
      const response = await fetch(
        `https://siiso.site/api/v1/members/search?nickNameOrEmail=${query}`
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

  // ---------------------------
  // 멤버 프로필 조회
  // ---------------------------
  fetchMemberProfile: async (memberId: number) => {
    console.log(`Fetching member profile for memberId: ${memberId}`);
    try {
      const response = await fetch(`https://siiso.site/api/v1/members/${memberId}`);
      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error(`Failed to fetch member profile: ${response.statusText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("API Response:", data); // API 응답 로그 추가
        const memberProfile = {
          id: memberId,
          email: data.email || "",
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
  // ---------------------------
  // Todo(스케줄) 추가
  // ---------------------------
  addTodo: async (memberId: number, newTodo: Omit<Schedule, "id">): Promise<Schedule> => {
    try {
      const response = await fetch(`https://siiso.site/api/v1/schedules/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add todo");
      }

      const data: Schedule = await response.json();
      return data; // 항상 Schedule 반환
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error; // 에러를 호출한 쪽에서 처리하도록 전달
    }
  },

  // ---------------------------
  // goal 추가
  // ---------------------------
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

  // ---------------------------
  // goal 완료 토글
  // ---------------------------
  toggleGoalCompletion: (id: number) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
  },

  // ---------------------------
  // goal 삭제
  // ---------------------------
  deleteGoal: (id: number) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },
  // ---------------------------
  // 닉네임 수정
  // ---------------------------
  updateNickname: async (memberId: number, nickname: string) => {
    try {
      const response = await fetch(`http://siiso.site/api/v1/members/${memberId}/nickname`, {
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
  // --------------------------
  // goal 진행도 업데이트
  // ---------------------------
  updateProgress: async (goalId: number, progress: number) => {
    const { memberId } = get();
    if (memberId !== null) {
      try {
        const response = await fetch(`http://siiso.site/api/v1/member/${memberId}/goal/${goalId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ progress }),
        });

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
  // ---------------------------
  // 자기소개 수정
  // ---------------------------
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

  // ---------------------------
  // 프로필 사진 수정
  // ---------------------------
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

      const text = await response.text();
      console.log("Profile picture update successful:", text);
      set((state) => ({
        memberProfile: {
          ...state.memberProfile,
          profileUrl: text,
        },
      }));
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    }
  },
});

// ---------------------------
// 최종 export
// ---------------------------
export const useStore = create<StoreState>()(
  persist(stateCreator, {
    name: "user-store", // 로컬 스토리지 키
    storage: storage,
  })
);
