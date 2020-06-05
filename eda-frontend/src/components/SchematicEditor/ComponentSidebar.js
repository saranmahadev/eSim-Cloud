import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import {
  Hidden,
  List,
  ListItem,
  Collapse,
  ListItemIcon,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import CloseIcon from '@material-ui/icons/Close'

import './Helper/SchematicEditor.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLibraries, toggleCollapse, fetchComponents, toggleSimulate } from '../../redux/actions/index'
import SideComp from './SideComp.js'
import SimulationProperties from './SimulationProperties'
const COMPONENTS_PER_ROW = 3

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: '90px'
  },
  nested: {
    paddingLeft: theme.spacing(2),
    width: '100%'
  },
  head: {
    marginRight: 'auto'
  }
}))

export default function ComponentSidebar ({ compRef }) {
  const classes = useStyles()
  const libraries = useSelector(state => state.schematicEditorReducer.libraries)
  const collapse = useSelector(state => state.schematicEditorReducer.collapse)
  const components = useSelector(state => state.schematicEditorReducer.components)
  const isSimulate = useSelector(state => state.schematicEditorReducer.isSimulate)

  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('')

  const [searchedComponentList, setSearchedComponents] = useState([])
  // const searchedComponentList = React.useRef([])

  const timeoutId = React.useRef()

  const handleSearchText = (evt) => {
    if (searchText.length === 0) {
      setSearchedComponents([])
    }
    setSearchText(evt.target.value)
    // mimic the value so we can access the latest value in our API call.

    // call api from here. and set the result to searchedComponentList.
  }

  const callApi = (query) => {
    // call api here. and set searchedComponentList

    axios.get(`http://localhost/api/components/?name__contains=${query}`)
      .then(res => {
      // searchedComponentList.current = res.data
        console.log('LIST', res.data)
        setSearchedComponents([...res.data])

        console.log('SEARCHED COMPONENTS', searchedComponentList)
      })
  }

  React.useEffect(() => {
    // if the user keeps typing, stop the API call!
    clearTimeout(timeoutId.current)
    // don't make an API call with no data
    if (!searchText.trim()) return
    // capture the timeoutId so we can
    // stop the call if the user keeps typing
    timeoutId.current = setTimeout(() => {
      // grab our query, but store it in state so
      // I can show it to you below in the example 😄
      // setQuery(inputRef.current)

      // call api here
      callApi(searchText)
      console.log('SEARCHED COMPONENTS2', searchedComponentList)
      // here we pass a callback so we get the current callCount value
      // from the useState hook's setter function
      // we use a Ref for timeoutId to avoid this same problem
    }, 800)
  }, [searchText])

  // call this method with search api response
  // const handleSearchedComponentList = (searchedComponentList) => {
  //   setSearchedComponents(searchedComponentList)
  // }

  const handleCollapse = (id) => {
    // console.log('Current: ', collapse[id], components[id].length)

    // Fetches Components for given library if not already fetched
    if (collapse[id] === false && components[id].length === 0) {
      // console.log('Components not fetched earlier, fetching.')
      dispatch(fetchComponents(id))
    }

    // Updates state of collapse to show/hide dropdown
    dispatch(toggleCollapse(id))
    // console.log(collapse)
  }

  // For Fetching Libraries
  useEffect(() => {
    dispatch(fetchLibraries())
  }, [dispatch])

  // Used to chunk array
  const chunk = (array, size) => {
    return array.reduce((chunks, item, i) => {
      if (i % size === 0) {
        chunks.push([item])
      } else {
        chunks[chunks.length - 1].push(item)
      }
      return chunks
    }, [])
  }

  return (
    <>
      <Hidden smDown>
        <div className={classes.toolbar} />
      </Hidden>

      <div style={isSimulate ? { display: 'none' } : {}}>
        {/* Display List of categorized components */}
        <List>
          <ListItem button divider>
            <h2 style={{ margin: '5px' }}>Components List</h2>
          </ListItem>
          <ListItem>

            <TextField
              id="standard-number"
              placeholder="Search Component"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={handleSearchText}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>
                )
              }}
            />

          </ListItem>

          { searchText.length !== 0 &&

                    searchedComponentList.map((component) => {
                      // console.log(component)
                      return (<ListItemIcon key={component.full_name}>
                        <SideComp component={component} />
                      </ListItemIcon>)
                    }
                    )

          }

          {/* Collapsing List Mapped by Libraries fetched by the API */}
          {searchText.length === 0 &&
            libraries.map(
              (library) => {
                return (
                  <div key={library.id}>
                    <ListItem onClick={(e, id = library.id) => handleCollapse(id)} button divider>
                      <span className={classes.head}>{library.library_name.slice(0, -4)}</span>
                      {collapse[library.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={collapse[library.id]} timeout={'auto'} unmountOnExit mountOnEnter exit={false}>
                      <List component="div" disablePadding dense >

                        {/* Chunked Components of Library */}
                        {
                          chunk(components[library.id], COMPONENTS_PER_ROW).map((componentChunk) => {
                            console.log('THIS IS COMPONENT CHUNK', componentChunk)
                            return (
                              <ListItem key={componentChunk[0].svg_path} divider>
                                {
                                  componentChunk.map((component) => {
                                    // console.log(component)
                                    return (<ListItemIcon key={component.full_name}>
                                      <SideComp component={component} />
                                    </ListItemIcon>)
                                  }
                                  )
                                }
                              </ListItem>
                            )
                          })
                        }

                      </List>
                    </Collapse>
                  </div>
                )
              }
            )
          }
        </List>
      </div>
      <div style={isSimulate ? {} : { display: 'none' }}>
        <List>
          <ListItem button divider>
            <h2 style={{ margin: '5px auto 5px 5px' }}>Simulation Modes</h2>
            <Tooltip title="close">
              <IconButton color="inherit" className={classes.tools} size="small" onClick={() => { dispatch(toggleSimulate()) }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItem>
          <SimulationProperties />
        </List>
      </div>
    </>
  )
}

ComponentSidebar.propTypes = {
  compRef: PropTypes.object.isRequired
}
