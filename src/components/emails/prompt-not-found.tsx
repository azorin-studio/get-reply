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
  promptName: string | null;
}

export const PromptNotFound = ({
  promptName = 'placeholder-for-testing@getreply.app',
}: PromptNotFoundProps) => (
  <Html>
    <Head />
    <Preview>GetReply Prompt not found</Preview>
    <Body style={main}>
      <Text style={{ ...text }}>
        Error from GetReply. You tried to email theGetReply prompt {promptName}@getreply.app, but it doesn&apos;t exist.
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
