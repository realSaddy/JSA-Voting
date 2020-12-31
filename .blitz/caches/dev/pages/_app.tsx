import "app/app.css";

import {
  AppProps,
  ErrorComponent,
  useRouter,
  AuthenticationError,
  AuthorizationError,
} from "blitz";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { queryCache } from "react-query";
import Index from "pages/index";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#fff",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries();
      }}
    >
      <MuiThemeProvider theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </MuiThemeProvider>
    </ErrorBoundary>
  );
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof AuthenticationError) {
    return <Index />;
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    );
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode || 400}
        title={error.message || error.name}
      />
    );
  }
}
