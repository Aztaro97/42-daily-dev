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

	// Edit Profile Modal
	showPictureModal: boolean;
	setShowPictureModal: (val: boolean) => void;

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

	showPictureModal: false,
	setShowPictureModal: (showPictureModal) => set({ showPictureModal }),
}))

export default useStore;