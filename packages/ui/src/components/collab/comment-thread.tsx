'use client';

import * as React from 'react';
import { Reply, Heart, Smile } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Button } from '../Button';

export interface Comment {
  id: string;
  author: { id: string; name: string; avatar?: string };
  body: string;
  timestamp: string;
  reactions?: Record<string, number>;
  replies?: Comment[];
}

/**
 * CommentThread — threaded comments with reply + reactions + mention support.
 * @mention parsing renders mentions as styled spans (parent supplies links).
 * (TIER 5)
 */
export function CommentThread({
  comments,
  onReply,
  onReact,
  className,
  depth = 0,
}: {
  comments: Comment[];
  onReply?: (parentId: string, body: string) => void;
  onReact?: (id: string, emoji: string) => void;
  className?: string;
  depth?: number;
}) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} onReply={onReply} onReact={onReact} depth={depth} />
      ))}
    </ul>
  );
}

function CommentItem({
  comment,
  onReply,
  onReact,
  depth,
}: {
  comment: Comment;
  onReply?: (parentId: string, body: string) => void;
  onReact?: (id: string, emoji: string) => void;
  depth: number;
}) {
  const [replying, setReplying] = React.useState(false);
  const [text, setText] = React.useState('');
  return (
    <li className={cn('flex gap-3', depth > 0 && 'ml-10')}>
      <Avatar className="h-8 w-8 shrink-0">
        {comment.author.avatar ? (
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        ) : null}
        <AvatarFallback>{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 text-sm">
          <strong>{comment.author.name}</strong>
          <time dateTime={comment.timestamp} className="text-xs text-muted-fg">
            {new Date(comment.timestamp).toLocaleString()}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-sm">{renderMentions(comment.body)}</p>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {onReact ? (
            <Button size="sm" variant="ghost" onClick={() => onReact(comment.id, '❤️')}>
              <Heart className="mr-1 h-3 w-3" />
              {comment.reactions?.['❤️'] ?? 0}
            </Button>
          ) : null}
          {onReact ? (
            <Button size="sm" variant="ghost" onClick={() => onReact(comment.id, '😊')}>
              <Smile className="mr-1 h-3 w-3" />
              {comment.reactions?.['😊'] ?? 0}
            </Button>
          ) : null}
          {onReply ? (
            <Button size="sm" variant="ghost" onClick={() => setReplying((r) => !r)}>
              <Reply className="mr-1 h-3 w-3" />
              Reply
            </Button>
          ) : null}
        </div>
        {replying && onReply ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                onReply(comment.id, text.trim());
                setText('');
                setReplying(false);
              }
            }}
            className="mt-2 flex gap-2"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a reply (use @ to mention)…"
              className="flex-1 rounded-md border border-input bg-background p-2 text-sm"
              rows={2}
              aria-label="Reply"
            />
            <Button size="sm" type="submit">
              Post
            </Button>
          </form>
        ) : null}
        {comment.replies && comment.replies.length > 0 ? (
          <CommentThread
            comments={comment.replies}
            onReply={onReply}
            onReact={onReact}
            depth={depth + 1}
            className="mt-3"
          />
        ) : null}
      </div>
    </li>
  );
}

function renderMentions(body: string): React.ReactNode {
  const parts = body.split(/(@\w+)/g);
  return parts.map((p, i) =>
    p.startsWith('@') ? (
      <span key={i} className="rounded bg-primary/10 px-1 font-medium text-primary">
        {p}
      </span>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    )
  );
}
