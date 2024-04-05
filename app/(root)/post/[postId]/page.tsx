type PostPageProps = {
  params: {
    postId: string;
  };
};

export default function PostPage({ params }: PostPageProps) {
  const { postId } = params;

  return <main>PostPage</main>;
}
