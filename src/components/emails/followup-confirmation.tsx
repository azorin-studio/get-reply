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

interface IFollowUpConfirmation {
  to: string;
  id: string;
}

export const introText = `Confirmation from GetReply`

const FollowUpConfirmation = ({ 
  to = 'placeholder@example.com, someone@example.com', 
  id = 'faw4kemfowenfawlije4nfawlin4ralwkn4',
 }: IFollowUpConfirmation) => (
  <Html>
    <Head />
    <Preview>{introText}</Preview>
    <Body style={main}>
      <Text style={text}> 
      New Sequence 
        (<Link
          href={`https://getreply.app/logs/${id}`}
          target="_blank"
          style={link}
        >
          link   
        </Link>) for {to} started on getreply. {' '}
        <Link
          href={`https://getreply.app/logs/${id}?cancel=`}
          target="_blank"
          style={link}
        >
          Click here to cancel
        </Link>.
      </Text>        
    </Body>
  </Html>
);

export default FollowUpConfirmation;

