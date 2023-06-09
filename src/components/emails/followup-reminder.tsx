import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { main, container, h1, text, code, link } from './styles';

interface IFollowUpReminder {
  to?: string;
  cc?: string;
  subject: string;
  body: string;
  promptId: string;
  delay?: number | null | undefined;
  delayUnit?: string;
}

export const introText = `Reminder to follow up from GetReply`

const FollowUpReminder = ({ 
  to = 'placeholder@example.com,someone@example.com', 
  cc = 'other@example.com',
  subject = 'Reminder to follow up from GetReply',
  delay = 1,
  delayUnit = 'second',
body = `Hi there,

I hope this email finds you well. Just wanted to touch base with you regarding my previous email about printing the word "dcc5d." I understand that you might be busy, but if you could take a moment to let me know if you were able to print it, I would greatly appreciate it.

Looking forward to hearing from you soon.

Best regards,`,
  promptId = 'placeholder',
 }: IFollowUpReminder) => (
  <Html>
    <Head />
    <Preview>{introText}</Preview>
    <Body style={main}>

      <Text style={{ ...text }}>
        Reminder ({delay}{delayUnit}) to follow up with: {to}
      </Text>
      
      <Text style={{ 
        ...text,
        padding: '4px',
        backgroundColor: '#f4f4f4',
        borderRadius: '5px',
        border: '1px solid #eee',
        color: '#333',
        whiteSpace: 'pre-line'
      }}>
        {body}
      </Text>

      <Text
        style={{
          ...text,
          color: '#ababab',
        }}
      >
        <Link
          href={`https://getreply.app/prompts/${promptId}${body && `?text=${encodeURIComponent(body).slice(0, 2000)}`}`}
          target="_blank"
          style={link}
        >Regenerate the message on using ChatGPT on GetReply            
        </Link>.
      </Text>
    </Body>
  </Html>
);

export default FollowUpReminder;

