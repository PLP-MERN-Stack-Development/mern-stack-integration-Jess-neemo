import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    postService.getPost(slug)
      .then(res => setPost(res.data || res))
      .catch(console.error);
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
      <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />
      <div className="prose">{post.content}</div>
    </div>
  );
}