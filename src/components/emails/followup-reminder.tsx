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
import { code, container, h1, main, text, link } from './sequence-not-found';

interface IFollowUpReminder {
  to?: string;
  cc?: string;
  subject: string;
  body: string;
  promptId: string;
}

export const introText = `Reminder to follow up from GetReply`

const FollowUpReminder = ({ 
  to = 'placeholder@example.com,someone@example.com', 
  cc = 'other@example.com',
  subject = 'Reminder to follow up from GetReply',
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
      <Container style={container}>
        <Heading style={{...h1, margin: '12px 0',}}>{introText}</Heading>
        <Text style={{ ...text, margin: '12px 0', }}>
          Reminder to follow up with:
        </Text>
        <code style={code}>{to || 'No to address.'}</code>
        {cc ? (
          <Container>
          <Text style={{ ...text, margin: '12px 0' }}>
            and cc: 
          </Text>
          <code style={code}>{cc}</code>
          </Container>
        ) : null}

        <Text style={{ ...text, margin: '12px 0', }}>
          Subject
        </Text>

        <Text style={{ 
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          padding: '16px 4.5%',
          width: '90.5%',
          backgroundColor: '#f4f4f4',
          borderRadius: '5px',
          border: '1px solid #eee',
          color: '#333',
        }}>
          {subject}
        </Text>


        <Text style={{ ...text, margin: '12px 0' }}>
          Here is a draft message:
        </Text>

        <Text style={{ 
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          fontSize: '14px',
          display: 'inline-block',
          margin: '0',
          padding: '16px 4.5%',
          width: '90.5%',
          backgroundColor: '#f4f4f4',
          borderRadius: '5px',
          border: '1px solid #eee',
          color: '#333',
          whiteSpace: 'pre-line'
        }}>
          {body}
        </Text>

        <Container style={{ margin: '24px 0', marginBottom:'70%' }}>
        <Text
          style={{
            ...text,
            color: '#ababab',
          }}
        >{' - '}
          <Link
            href={`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.slice(0, 2000))}`}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Click here to open your email client with the email pre-filled.
          </Link>.
        </Text>
        <Text
          style={{
            ...text,
            color: '#ababab',
          }}
        >{' - '}
           <Link
            href={`https://getreply.app/prompts/${promptId}${body && `?text=${encodeURIComponent(body).slice(0, 2000)}`}`}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >Regenerate the message on using ChatGPT on GetReply
            
          </Link>.
        </Text>
        </Container> 

      </Container>
    </Body>
  </Html>
);

export default FollowUpReminder;

