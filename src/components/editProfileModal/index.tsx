import React, { useEffect } from "react"
import { Button, Modal } from "react-daisyui"

import { api } from "@/utils/api"
import useStore from "@/stores/useStore"
import EditProfileForm from "./editProfileForm"

export default function EditProfileModal() {
  const { data: userData, isLoading } = api.user.getMyProfile.useQuery()
  const { showEditModal, setShowEditModal } = useStore()

  return (
    <Modal open={showEditModal} backdrop={true}>
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={() => setShowEditModal(false)}
      >
        ✕
      </Button>
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Body >
        {isLoading ? (
          <EditProfileForm.Skeleton />
        ) : (
          <EditProfileForm data={userData as any} />
        )}
      </Modal.Body>
    </Modal>
  )
}
