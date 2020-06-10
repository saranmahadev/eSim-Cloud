import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Button,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  TextField,
  Card,
  Avatar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../redux/actions/index'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(27),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3, 5)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

export default function SignIn () {
  const classes = useStyles()

  useEffect(() => {
    document.title = 'Login - eSim '
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  return (
    <Container component="main" maxWidth="xs">
      <Card className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Login | Sign IN
        </Typography>

        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="email"
            autoComplete="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => dispatch(login(username, password))}
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {'New User? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Button
        component={RouterLink}
        to="/"
        fullWidth
        color="default"
        className={classes.submit}
      >
        Back to home
      </Button>
    </Container>
  )
}
