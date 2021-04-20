import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { CssBaseline, Typography } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Header from './components/Header';
import Me from './components/Me';
import Projects from './components/Projects';
import './App.scss';

/**
 * Use Apollo to connect to GitHub using GraphQL
 */
const token = process.env.REACT_APP_TOKEN || "";
const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  //const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

/**
 * Create a custom theme for the application
 */
var theme = createMuiTheme({
  palette: {
    primary: {
      main: "#777",
    },
    secondary: {
      main: "#000"
    },
    background: {
      default: "#DDD"
    },
    text: {
      primary: "#FFF",
      secondary: "#000"
    }
  },
  typography: {
    fontFamily: ["'Permanent Marker'", "cursive"].join(","),
  },

});

theme.typography.body1 = {
  fontSize: "44px",
  [theme.breakpoints.up('xs')]: {
    fontSize: 'clamp(44px,14vw,150px)'
  }
};

//theme = responsiveFontSizes(theme);

let style = {
  section: {
    padding: "0px 24px",
    height: "100vh"
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: "left",
    //fontSize: "150px" 
  },
  sectionBody: {
    marginLeft: 50
  }
}

function App() {
  return (
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Header color="primary"/>
          <div style={style.section}>
            <div id="projects" style={style.sectionHeader}>
              <Typography variant="body1">
                _Projects
              </Typography>
            </div>
            <Projects style={style.sectionBody}/>
          </div>
          <div style={style.section} >
            <div id="me" style={style.sectionHeader}>
              <Typography variant="body1">
                _Me
              </Typography>
            </div>
            <Me style={style.sectionBody}/>
          </div>
          
        </div>
      </MuiThemeProvider>
    </ApolloProvider >
  );
}

export default App;
