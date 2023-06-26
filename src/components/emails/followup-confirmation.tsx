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

interface IFollowUpConfirmation {
  to?: string;
  id: string;
}

export const introText = `Confirmation from GetReply`

const FollowUpConfirmation = ({ 
  to = 'placeholder@example.com,someone@example.com', 
  id = 'faw4kemfowenfawlije4nfawlin4ralwkn4',
 }: IFollowUpConfirmation) => (
  <Html>
    <Head />
    <Preview>{introText}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={{...h1, margin: '12px 0',}}>{introText}</Heading>
        <Container style={{ margin: '24px 0' }}>
        <Text
          style={{
            ...text,
            color: '#ababab',
          }}
        >{' - '}
          <Link
            href={`https://getreply.app/logs/${id}`}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Click here to view the job
          </Link>.
        </Text>
        <Text
          style={{
            ...text,
            color: '#ababab',
          }}
        >{' - '}
          <Link
            href={`https://getreply.app/logs/${id}?cancel=`}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Click here to cancel
          </Link>.
        </Text>
        </Container> 
        <Text style={{ ...text, margin: '12px 0', }}>
          We will notify you in a few days to follow up with:
        </Text>
        <code style={code}>{to || 'No to address.'}</code>
        
      </Container>
    </Body>
  </Html>
);

export default FollowUpConfirmation;

