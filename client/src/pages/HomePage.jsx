// client/src/pages/HomePage.jsx
import { usePosts } from '../hooks/usePosts';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <p className="text-red-600">Error loading posts: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          posts.map((post) => (
            <Link key={post._id || post.id} to={`/posts/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2">
                {post.excerpt || post.content?.substring(0, 150)}...
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}