import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import {
    FaUserCircle,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaCalendarAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaUserShield,
    FaCheckCircle
} from 'react-icons/fa'

import AdminLayout from '../Components/Admin/AdminLayout'

import {
    getAllUsersAPI,
    updateUserAPI
} from '../services/allAPI'


const defaultProfile = {
    name: 'CivicPulse Administrator',
    email: 'admin@civicpulse.demo',
    phone: '+91 98765 00000',
    location: 'Kerala, India',
    adminId: 'CP-ADMIN-001',
    role: 'admin',
    joined: '01 October 2026',
    status: 'Active'
}


function AdminProfile() {

    const [profile, setProfile] = useState(defaultProfile)

    const [draftProfile, setDraftProfile] = useState(defaultProfile)

    const [adminUserId, setAdminUserId] = useState(null)

    const [isEditing, setIsEditing] = useState(false)

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    const [saveMessage, setSaveMessage] = useState('')

    const personalInfoRef = useRef(null)

    // load admin profile
    useEffect(() => {

        const loadAdminProfile = async () => {

            try {

                setLoading(true)

                const response = await getAllUsersAPI()

                const users = Array.isArray(response?.data)
                    ? response.data
                    : []


                const admin = users.find(
                    (user) =>
                        user.role?.toLowerCase() === 'admin'
                )


                if (!admin) {

                    toast.error('Administrator account not found')

                    return
                }


                setAdminUserId(admin.id)


                const backendProfile = {

                    name: admin.name || defaultProfile.name,

                    email: admin.email || defaultProfile.email,

                    phone: admin.phone || defaultProfile.phone,

                    location: admin.location || defaultProfile.location,

                    adminId:
                        admin.adminId ||
                        `CP-ADMIN-${String(admin.id).padStart(3, '0')}`,

                    role: admin.role || 'admin',

                    joined:
                        admin.joined ||
                        defaultProfile.joined,

                    status:
                        admin.status ||
                        'Active'

                }


                setProfile(backendProfile)

                setDraftProfile(backendProfile)


            } catch (error) {

                console.error(
                    'Admin profile loading error:',
                    error
                )

                toast.error(
                    'Unable to load administrator profile'
                )

            } finally {

                setLoading(false)

            }

        }


        loadAdminProfile()

    }, [])

    // EDIT
    const handleEdit = () => {

        setDraftProfile(profile)

        setSaveMessage('')

        setIsEditing(true)


        setTimeout(() => {

            personalInfoRef.current?.scrollIntoView({

                behavior: 'smooth',

                block: 'start'

            })

        }, 100)

    }

    // INPUT CHANGE
    const handleChange = (event) => {
        const {
            name,
            value
        } = event.target

        setDraftProfile((previous) => ({
            ...previous,
            [name]: value
        }))
    }

    // SAVE PROFILE
    const handleSave = async (event) => {

        event.preventDefault()

        if (!adminUserId) {

            setSaveMessage(
                'Administrator account could not be found.'
            )

            return

        }

        if (

            !draftProfile.name.trim() ||

            !draftProfile.email.trim() ||

            !draftProfile.phone.trim() ||

            !draftProfile.location.trim()

        ) {

            setSaveMessage(
                'Please fill in all personal information fields.'
            )

            return

        }


        try {

            setSaving(true)

            setSaveMessage('')


            const updateData = {

                name: draftProfile.name.trim(),

                email: draftProfile.email.trim(),

                phone: draftProfile.phone.trim(),

                location: draftProfile.location.trim()

            }


            const response = await updateUserAPI(
                adminUserId,
                updateData
            )


            const updatedAdmin = response?.data


            const updatedProfile = {

                ...profile,

                ...draftProfile,

                ...updatedAdmin

            }


            setProfile(updatedProfile)

            setDraftProfile(updatedProfile)

            setIsEditing(false)

            setSaveMessage(
                'Profile changes saved successfully.'
            )


            toast.success(
                'Administrator profile updated successfully'
            )


        } catch (error) {

            console.error(
                'Admin profile update error:',
                error
            )


            setSaveMessage(
                'Unable to save profile changes. Please try again.'
            )


            toast.error(
                'Failed to update administrator profile'
            )

        } finally {

            setSaving(false)

        }

    }

    // CANCEL
    const handleCancel = () => {

        setDraftProfile(profile)

        setIsEditing(false)

        setSaveMessage('')

    }

    // LOADING SCREEN
    if (loading) {

        return (

            <AdminLayout>

                <div className="admin-loading">

                    <div className="admin-loading-icon">

                        <FaUserCircle />

                    </div>

                    <p>
                        Loading administrator profile...
                    </p>

                </div>

            </AdminLayout>

        )

    }

    // MAIN UI
    return (

        <AdminLayout>

            <div className="admin-profile-page">


                {/* PAGE HEADING */}

                <div className="admin-profile-heading">

                    <div>

                        <span className="admin-profile-eyebrow">

                            ADMINISTRATION / ACCOUNT

                        </span>


                        <h1>
                            My Profile
                        </h1>


                        <p>
                            Manage your administrator information and account details.
                        </p>

                    </div>


                    <div className="admin-profile-heading-icon">

                        <FaUserCircle />

                    </div>

                </div>



                {/* PROFILE BANNER */}

                <section className="admin-profile-banner">

                    <div className="admin-profile-banner-pattern"></div>


                    <div className="admin-profile-banner-content">


                        <div className="admin-profile-avatar">

                            <FaUserCircle />

                            <span className="admin-profile-online-dot"></span>

                        </div>



                        <div className="admin-profile-banner-info">


                            <span className="admin-profile-role-label">

                                <FaShieldAlt />

                                VERIFIED ADMINISTRATOR

                            </span>


                            <h2>
                                {profile.name}
                            </h2>


                            <p>
                                {profile.email}
                            </p>


                            <div className="admin-profile-banner-meta">

                                <span>

                                    <FaUserShield />

                                    Administrator

                                </span>


                                <span>

                                    <FaMapMarkerAlt />

                                    {profile.location}

                                </span>

                            </div>

                        </div>


                        {!isEditing && (

                            <button

                                type="button"

                                className="admin-profile-edit-button"

                                onClick={handleEdit}

                            >

                                <FaEdit />

                                Edit Profile

                            </button>

                        )}

                    </div>

                </section>



                {/* ACCOUNT OVERVIEW */}
                <div className="admin-profile-overview-grid">

                    <div className="admin-profile-overview-card">

                        <div className="admin-profile-overview-icon green">

                            <FaShieldAlt />

                        </div>


                        <div>

                            <span>
                                Account Role
                            </span>

                            <strong>
                                Administrator
                            </strong>

                            <small>
                                Administrative access
                            </small>

                        </div>

                    </div>


                    <div className="admin-profile-overview-card">

                        <div className="admin-profile-overview-icon blue">

                            <FaCheckCircle />

                        </div>


                        <div>

                            <span>
                                Account Status
                            </span>

                            <strong>
                                {profile.status}
                            </strong>

                            <small>
                                Administrator account
                            </small>

                        </div>

                    </div>



                    <div className="admin-profile-overview-card">

                        <div className="admin-profile-overview-icon amber">

                            <FaCalendarAlt />

                        </div>


                        <div>

                            <span>
                                Member Since
                            </span>

                            <strong>
                                {profile.joined}
                            </strong>

                            <small>
                                Administrator profile
                            </small>

                        </div>

                    </div>


                </div>



                {/* PERSONAL INFORMATION */}
                <section
                    className="admin-profile-details-card"
                    ref={personalInfoRef}
                >


                    <div className="admin-profile-section-heading">

                        <div>

                            <h3>
                                Personal Information
                            </h3>

                            <p>
                                Review and update your contact details.
                            </p>

                        </div>


                        <div className="admin-profile-section-icon">

                            <FaUserCircle />

                        </div>

                    </div>



                    {/* SAVE MESSAGE */}
                    {saveMessage && (

                        <div

                            className={`admin-profile-message ${
                                saveMessage.startsWith('Please') ||
                                saveMessage.startsWith('Unable') ||
                                saveMessage.startsWith('Administrator account')
                                    ? 'error'
                                    : 'success'
                            }`}

                            role="status"

                        >

                            {saveMessage.startsWith('Please') ||
                            saveMessage.startsWith('Unable') ||
                            saveMessage.startsWith('Administrator account')
                                ? (
                                    <FaTimes />
                                )
                                : (
                                    <FaCheckCircle />
                                )
                            }

                            {saveMessage}

                        </div>

                    )}



                    <form onSubmit={handleSave}>


                        <div className="admin-profile-form-grid">


                            {/* NAME */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-name">

                                    Full Name

                                </label>


                                <div
                                    className={`admin-profile-input-wrap ${
                                        isEditing ? 'editable' : ''
                                    }`}
                                >

                                    <FaUserCircle />

                                    <input

                                        id="profile-name"

                                        name="name"

                                        type="text"

                                        value={
                                            isEditing
                                                ? draftProfile.name
                                                : profile.name
                                        }

                                        onChange={handleChange}

                                        disabled={!isEditing}

                                        required

                                    />

                                </div>

                            </div>



                            {/* EMAIL */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-email">

                                    Email Address

                                </label>


                                <div
                                    className={`admin-profile-input-wrap ${
                                        isEditing ? 'editable' : ''
                                    }`}
                                >

                                    <FaEnvelope />

                                    <input

                                        id="profile-email"

                                        name="email"

                                        type="email"

                                        value={
                                            isEditing
                                                ? draftProfile.email
                                                : profile.email
                                        }

                                        onChange={handleChange}

                                        disabled={!isEditing}

                                        required

                                    />

                                </div>

                            </div>



                            {/* PHONE */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-phone">

                                    Phone Number

                                </label>


                                <div
                                    className={`admin-profile-input-wrap ${
                                        isEditing ? 'editable' : ''
                                    }`}
                                >

                                    <FaPhoneAlt />

                                    <input

                                        id="profile-phone"

                                        name="phone"

                                        type="tel"

                                        value={
                                            isEditing
                                                ? draftProfile.phone
                                                : profile.phone
                                        }

                                        onChange={handleChange}

                                        disabled={!isEditing}

                                        required

                                    />

                                </div>

                            </div>



                            {/* LOCATION */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-location">

                                    Location

                                </label>


                                <div
                                    className={`admin-profile-input-wrap ${
                                        isEditing ? 'editable' : ''
                                    }`}
                                >

                                    <FaMapMarkerAlt />

                                    <input

                                        id="profile-location"

                                        name="location"

                                        type="text"

                                        value={
                                            isEditing
                                                ? draftProfile.location
                                                : profile.location
                                        }

                                        onChange={handleChange}

                                        disabled={!isEditing}

                                        required

                                    />

                                </div>

                            </div>



                            {/* ADMIN ID */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-admin-id">

                                    Administrator ID

                                </label>


                                <div className="admin-profile-input-wrap locked">

                                    <FaShieldAlt />

                                    <input

                                        id="profile-admin-id"

                                        type="text"

                                        value={profile.adminId}

                                        disabled

                                        readOnly

                                    />

                                </div>


                                <small className="admin-profile-field-hint">

                                    This identifier cannot be changed.

                                </small>

                            </div>



                            {/* ROLE */}

                            <div className="admin-profile-field">

                                <label htmlFor="profile-role">

                                    Account Role

                                </label>


                                <div className="admin-profile-input-wrap locked">

                                    <FaUserShield />

                                    <input

                                        id="profile-role"

                                        type="text"

                                        value="Administrator"

                                        disabled

                                        readOnly

                                    />

                                </div>


                                <small className="admin-profile-field-hint">

                                    Role changes require authorization.

                                </small>

                            </div>


                        </div>



                        {/* ACTION BUTTONS */}

                        {isEditing && (

                            <div className="admin-profile-form-actions">


                                <button

                                    type="button"

                                    className="admin-profile-cancel-button"

                                    onClick={handleCancel}

                                    disabled={saving}

                                >

                                    <FaTimes />

                                    Cancel

                                </button>



                                <button

                                    type="submit"

                                    className="admin-profile-save-button"

                                    disabled={saving}

                                >

                                    <FaSave />

                                    {saving
                                        ? 'Saving...'
                                        : 'Save Changes'
                                    }

                                </button>


                            </div>

                        )}


                    </form>

                </section>



                {/* ACCOUNT NOTICE */}

                <div className="admin-profile-notice">


                    <div className="admin-profile-notice-icon">

                        <FaShieldAlt />

                    </div>


                    <div>

                        <h4>
                            Keep your account information up to date
                        </h4>


                        <p>

                            Accurate contact information helps maintain
                            clear communication during community issue
                            management. Profile changes are saved to
                            the administrator account in the backend.

                        </p>

                    </div>


                </div>


            </div>

        </AdminLayout>

    )

}


export default AdminProfile