import { create } from "zustand";

interface StateProps {
	showModal: boolean;
	setShowModal: (val: boolean) => void;
	toggleModal: () => void;

	// AsideBar Mobile Menu
	showAsideBar: boolean;
	setShowAsideBar: (val: boolean) => void;

	// Edit Profile Modal
	showEditModal: boolean;
	setShowEditModal: (val: boolean) => void;
	toggleShowEditModal: () => void;

}

const useStore = create<StateProps>((set) => ({
	showModal: false,
	setShowModal: (showModal) => set({ showModal }),
	toggleModal: () => set((state) => ({ showModal: !state.showModal })),

	showAsideBar: false,
	setShowAsideBar: (showAsideBar) => set({ showAsideBar }),

	showEditModal: false,
	setShowEditModal: (showEditModal) => set({ showEditModal }),
	toggleShowEditModal: () => set((state) => ({ showEditModal: !state.showEditModal })),
}))

export default useStore;