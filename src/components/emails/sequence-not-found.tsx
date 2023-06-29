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

interface SequenceNotFoundProps {
  sequenceName: string | null;
}

export const SequenceNotFound = ({
  sequenceName = 'placeholder-for-testing@getreply.app',
}: SequenceNotFoundProps) => (
  <Html>
    <Head />
    <Preview>GetReply Sequence not found</Preview>
    <Body style={main}>
      <Text style={{ ...text }}>
        Error from GetReply. You tried to email theGetReply sequence {sequenceName}@getreply.app, but it doesn&apos;t exist.
      </Text>
      <Text
          style={{
            ...text,
          }}
        >
          Check out the list of sequences in <Link
            href="https://getreply.app"
            target="_blank"
            style={...link}
          >
            GetReply
          </Link> to find what your looking for.
        </Text>
    </Body>
  </Html>
);

export default SequenceNotFound;
