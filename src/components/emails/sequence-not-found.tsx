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
      <Container style={container}>
        <Heading style={h1}>Error from GetReply</Heading>
        
        <Text style={{ ...text }}>
          You tried to email the following GetReply sequence, but it doesn&apos;t exist.
        </Text>
        <code style={{...code, margin: '12px 0'}}>{sequenceName}@getreply.app</code>
        <Text
          style={{
            ...text,
            color: '#ababab',
          }}
        >
          Check out the list of sequences in <Link
            href="https://getreply.app"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            GetReply
          </Link> to find what your looking for.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SequenceNotFound;
