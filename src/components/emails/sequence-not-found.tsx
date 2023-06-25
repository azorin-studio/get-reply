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
        
        <Text style={{ ...text, marginBottom: '14px' }}>
          You tried to email the following GetReply sequence, but it doesn&apos;t exist.
        </Text>
        <code style={code}>{sequenceName}@getreply.app</code>
        <Text
          style={{
            ...text,
            color: '#ababab',
            marginTop: '14px',
            marginBottom: '16px',
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

export const main = {
  backgroundColor: '#ffffff',
};

export const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

export const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

export const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
};

export const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

export const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

export const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
};
