import getConversations from '../actions/getConversations';
import Sidebar from '../components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';

export default async function ConvserationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">
        <ConversationList initialConversations={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
