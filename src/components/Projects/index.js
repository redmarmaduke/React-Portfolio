/**
 * Example code provided by material-ui.com
 */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar, IconButton } from '@material-ui/core';
import { GitHub as GitHubIcon } from '@material-ui/icons';

/**
 * Apollo setup
 */
import { useQuery, gql } from '@apollo/client';
import parseUri from './parseUri';

/**
 * Components
 */
import Image from '../Image';
//import Image from 'mui-image';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridList: {
    width: 1280,

    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  gridListTileRoot: {    
      aspectRatio: "2 / 1",
  },
  gridListTileTile: {    
    aspectRatio: "2 / 1", 
  },
    //imgFullHeight: {},
  gridListTileImgFullWidth: {
      width: "100%",
      aspectRatio: "2 / 1"
  },
  gridListTileImgFullHeight: {
    height: "100%",
    aspectRatio: "2 / 1"
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

/**
 * @constructor
 * @param {*} props 
 */
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
      <GridList className={classes.gridList} cellHeight='auto' cols={2} spacing={4}>
        {tiles.map((tile, index) => (
          <GridListTile classes={{
            root: classes.gridListTileRoot,
            tile: classes.gridListTileTile,
            imgFullWidth: classes.gridListTileImgFullWidth,
            imgFullHeight: classes.gridListTileImgFullHeight,
          }} key={index} cols={index === 0 ? 2 : 1} rows={index === 0 ? 2 : 1}>
            <ConditionalWrapper
              condition={tile.deployedUrl}
              wrapper={(children) => <a href={tile.deployedUrl}>{children}</a>}
            >
              <Image style={{ width: "100%", aspectRatio: "2 / 1" }} src={tile.img} alt={tile.title} />
            
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

