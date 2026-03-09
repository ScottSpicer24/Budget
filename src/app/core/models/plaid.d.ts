

interface PlaidOnSuccessMetadata {
  institution: { name: string; institution_id: string };
  accounts: Array<{
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
  }>;
  link_session_id: string;
}

interface PlaidOnExitMetadata {
  status: string | null;
  link_session_id: string;
  request_id: string;
}

interface PlaidLinkHandler {
  open(): void;
  destroy(): void;
}

interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string, metadata: PlaidOnSuccessMetadata) => void;
  onExit?: (err: Error | null, metadata: PlaidOnExitMetadata) => void;
  onLoad?: () => void;
  onEvent?: (eventName: string, metadata: object) => void;
}

interface Window {
  Plaid: {
    create(options: PlaidLinkOptions): PlaidLinkHandler;
  };
}
