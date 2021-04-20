/**
 * Example code provided by material-ui.com
 */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
//import StarBorderIcon from '@material-ui/icons/StarBorder';
import GitHubIcon from '@material-ui/icons/GitHub';

/**
 * Apollo setup
 */
import { useQuery, gql } from '@apollo/client';
import parseUri from './parseUri';



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));


// old REPOSITORIES graphQL query
/*
const REPOSITORIES = gql`
query {
  repositoryOwner(login: "redmarmaduke") {
    profileImageUrl: avatarUrl,
    repositories(first : 20, privacy: PUBLIC, ownerAffiliations: OWNER) {
      nodes {
        title: name
        githubUrl: url
        deployedUrl: homepageUrl
        img: openGraphImageUrl
      }
    }
  }
}
`;
*/

const PINNED_REPOSITORIES = gql`
  query {
    user(login: "redmarmaduke") {
      profileImageUrl: avatarUrl,
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
          title: name
          githubUrl: url
          deployedUrl: homepageUrl
          img: openGraphImageUrl
          }
        }
      }
  }  
  }
`;

/**
 * https://blog.hackages.io/conditionally-wrap-an-element-in-react-a8b9a47fab2
 * 
 * @param { 
 *          condition: boolean, 
 *          wrapper: React.Component,
 *          children: React.Component[]|React.Component
 *        } 
 * @returns children or wrapper containing the children
 */
const ConditionalWrapper = ({ condition, wrapper, children }) => {
  return condition ? wrapper(children) : <>{children}</>;
}

export default function Projects(props) {
  const classes = useStyles();
  var { loading, error, data } = useQuery(PINNED_REPOSITORIES);

  if (loading) {
    return <p>Loading</p>;
  }
  if (error) {
    console.log(error);
    return <p>Error</p>;
  }
  if (!data) {
    return <p>Not found!</p>;
  }
  {
    let { user: { pinnedItems: { nodes: newData } } } = data;
    data = newData;
  }

  var tiles = data.map(function (tile) {
    let datum = { ...tile };
    if (!tile.img || parseUri(tile.img).authority === "avatars.githubusercontent.com") {
      datum.img = `https://via.placeholder.com/1280x640.webp/000000/FFFFFF?text=${tile.title}`;
    }
    return datum;
  });

  return (
    <div className={classes.root}>
      {/*cols={() => 2.5}*/}
      <GridList className={classes.gridList} cols={1}>
        {tiles.map((tile, index) => (
          <GridListTile key={index} style={{ aspectRatio: "2/1", width: "clamp(320px, 67vw ,1280px)", height: "initial" }}>
            <ConditionalWrapper
              condition={tile.deployedUrl}
              wrapper={(children) => <a href={tile.deployedUrl}>{children}</a>}
            >
              <img style={{ maxWidth: "100%", maxHeight: "100%", aspectRatio: "2/1" }} src={tile.img} alt={tile.title} />
            </ConditionalWrapper>
            <GridListTileBar
              title={tile.title}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={tile.githubUrl ?
                <IconButton aria-label={`star ${tile.title}`}>
                  <a href={tile.githubUrl}><GitHubIcon className={classes.title} /></a>
                </IconButton> : <></>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

