import {
  Body,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { main, container, h1, text, code, link } from './styles';

interface PromptNotFoundProps {
  notFoundEmails: string[];
}

export const PromptNotFound = ({
  notFoundEmails = ['placeholder-for-testing@getreply.app'],
}: PromptNotFoundProps) => (
  <Html>
    <Head />
    <Preview>GetReply Prompt not found</Preview>
    <Body style={main}>
      <Text style={{ ...text }}>
        Error from GetReply. You tried to email theGetReply {notFoundEmails.join(', ')}, but it (they) doesn&apos;t exist.
        The entire sequence has been cancelled, please try again.
      </Text>
      <Text
          style={{
            ...text,
          }}
        >
          Check out the list of prompts in <Link
            href="https://getreply.app"
            target="_blank"
            style={link}
          >
            GetReply
          </Link> to find what your looking for.
        </Text>
    </Body>
  </Html>
);

export default PromptNotFound;
