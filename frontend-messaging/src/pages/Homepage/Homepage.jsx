import { useChat } from '../../context/ChatContext';
import styles from './Homepage.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import MessageContainer from '../../components/MessageContainer/MessageContainer';

function Homapage() {
	const { activeChatDetails } = useChat();

	return (
		<>
			<main className={styles.homepageMain}>
				<Sidebar></Sidebar>
				{activeChatDetails ? (
					<MessageContainer />
				) : (
					<div className={styles.mainContent}>
						<h2>Welcome to ChatSphere</h2>
						<p>Select a chat from the sidebar or create a new conversation</p>
					</div>
				)}
			</main>
		</>
	);
}

export default Homapage;
