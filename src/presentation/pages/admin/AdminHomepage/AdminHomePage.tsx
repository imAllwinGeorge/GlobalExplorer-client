import { useState } from "react"
import { useSelector } from "react-redux"
import ConfirmModal from "../../../components/ReusableComponents/ConfirmModal";


const AdminHomePage = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
    const user = useSelector(state => state)
    console.log("admin user", user)
    const [users, setUsers] = useState({
      name: "allwin",
      isBlocked: false
    });
    const handleState = () => {
      setUsers((state) => ({...state, isBlocked : !state.isBlocked}))
    }
  return (
    <div>
     {users && (
      <div>
        <h1>{users.name}</h1>
        <h1>{users.isBlocked? "true": "false"}</h1>
        <button onClick={() => {
          setIsModelOpen(true)
        }} >butn</button>
      </div>
     )}
     <ConfirmModal
     isOpen = {isModelOpen}
     onClose = { () => setIsModelOpen(false)} 
     onConfirm = {handleState}
     title = "state change"
     message = {`Are you sure you want to change the state to: ${!users.isBlocked}`}
     confirmText = "confirm"
     cancelText = "Cancel"
     variant = "info"
      />
    </div>
  )
}

export default AdminHomePage