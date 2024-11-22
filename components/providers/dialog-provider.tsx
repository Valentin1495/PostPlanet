import DeleteDialog from '../dialogs/delete-dialog';
import PostDialog from '../dialogs/post-dialog';
import ReplyDialog from '../dialogs/reply-dialog';

export default function DialogProvider() {
  return (
    <div>
      <DeleteDialog />
      <PostDialog />
      <ReplyDialog />
    </div>
  );
}
