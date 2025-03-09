/* eslint-disable react/prop-types */
import { useState } from 'react';
import styles from './UserInfoSection.module.css';

const UserInfoSection = ({ user }) => {
	const [newUsername, setNewUsername] = useState(user?.username || '');
	const [isEditing, setIsEditing] = useState(false);

	const handleUsernameChange = (e) => {
		setNewUsername(e.target.value);
	};

	const handleUpdateUsername = () => {
		console.log(
			`User is trying to update username from ${user.username} to ${newUsername}`,
		);
		// UPDATE USERNAME LOGIC
		setIsEditing(false);
	};

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
		// Reset to current username if canceling edit
		if (isEditing) {
			setNewUsername(user?.username || '');
		}
	};

	return (
		<div className={styles.section}>
			<h3 className={styles.sectionTitle}>User Information</h3>

			<div className={styles.infoGroup}>
				<label>Email Address</label>
				<div className={styles.infoValue}>{user.email}</div>
			</div>

			<div className={styles.infoGroup}>
				<label>Username</label>
				{isEditing ? (
					<div className={styles.editField}>
						<input
							type="text"
							value={newUsername}
							onChange={handleUsernameChange}
							className={styles.usernameInput}
						/>
						<div className={styles.actionButtons}>
							<button
								className={styles.saveButton}
								onClick={handleUpdateUsername}
							>
								Save
							</button>
							<button
								className={styles.cancelButton}
								onClick={handleEditToggle}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<div className={styles.usernameDisplay}>
						<span>{user.username}</span>
						<button className={styles.editButton} onClick={handleEditToggle}>
							Edit
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default UserInfoSection;
