import {create} from "zustand";

interface StateProps {
	showModal: boolean;
	setShowModal: (val:boolean) => void;
	toggleModal: () => void;
}

const useStore = create<StateProps>((set) => ({
	showModal: false,
	setShowModal: (showModal) => set({showModal}),
	toggleModal: () => set((state) => ({showModal: !state.showModal})),
}))

export default useStore;