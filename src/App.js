import React from "react";
import "./App.css";

import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Link,
  useParams,
} from "react-router-dom";
import {
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  Button,
  Card,
  Menu,
  Dropdown,
  Container,
  Header,
  Segment,
  Placeholder,
  Grid,
} from "semantic-ui-react";

import Amplify, { Auth } from "aws-amplify";
import API, { graphqlOperation } from "@aws-amplify/api";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { AmplifyAuthenticator, AmplifySignUp } from "@aws-amplify/ui-react";

import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";

//import faker from 'faker';
import {
  Analytics,
  AmazonPersonalizeProvider,
  AWSKinesisProvider,
} from "@aws-amplify/analytics";

import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

const CATEGORIES = [
  "Algebra",
  "Decimals",
  "Precalculus",
  "Trigonometry",
  "Statistics",
  "Calculus",
  "Geometry",
];
const COLORS = [
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "purple",
  "pink",
  "teal",
  "grey",
];
const CONTENTTYPE = ["Video", "Document", "Assessment"];

Analytics.autoTrack("session", {
  enable: true,
});

Analytics.addPluggable(new AmazonPersonalizeProvider());
Analytics.addPluggable(new AWSKinesisProvider());

Analytics.configure({
  AmazonPersonalize: {
    trackingId: "de49c5c5-1103-426a-ba8e-c8a6c7090613", // TODO: Set to Personalize Tracking ID
    region: awsconfig.aws_project_region,
  },
  AWSKinesis: {
    region: awsconfig.aws_project_region,
  },
});

function ContentCardImage({ contentName, minHeight, fontSize }) {
  function contentColor(name) {
    if (!name) name = "";
    return COLORS[Math.floor(name.length % COLORS.length)];
  }

  return (
    <Segment
      style={{ minHeight, display: "flex" }}
      inverted
      color={contentColor(contentName)}
      vertical
    >
      <Header style={{ margin: "auto auto", fontSize }}>{contentName}</Header>
    </Segment>
  );
}

ContentCardImage.propTypes = {
  contentName: PropTypes.string,
  minHeight: PropTypes.number,
  fontSize: PropTypes.number,
};

function ContentCreation() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [name, setName] = React.useState();
  const [category, setCategory] = React.useState();
  const [contentType, setContentType] = React.useState();
  const [desc, setDesc] = React.useState();

  function handleOpen() {
    Analytics.record({ name: "createContent-start" });
    handleReset();
    setModalOpen(true);
  }

  function handleReset() {
    setName("Algebra Level 1");
    setCategory(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    setContentType(CONTENTTYPE[Math.floor(Math.random() * CONTENTTYPE.length)]);
    setDesc("Content Description");
  }

  function handleClose() {
    setModalOpen(false);
  }

  async function handleSave(event) {
    event.preventDefault();
    let likes = 0;
    await API.graphql(
      graphqlOperation(mutations.createContent, {
        input: { name, category, contentType, desc, likes },
      })
    );
    handleClose();
  }

  const options_category = CATEGORIES.map((c) => ({
    key: c,
    value: c,
    text: c,
  }));

  const options_contenttype = CONTENTTYPE.map((c) => ({
    key: c,
    value: c,
    text: c,
  }));
  //<Icon name='plus'/>Create new content

  return (
    <Modal
      closeIcon
      size="small"
      open={modalOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      trigger={<p></p>}
    >
      <Modal.Header>Create new content</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Content Name</label>
            <Input
              fluid
              type="text"
              placeholder="Set Name"
              name="name"
              value={name || ""}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Category</label>
            <Dropdown
              fluid
              placeholder="Select Category"
              selection
              options={options_category}
              value={category}
              onChange={(e, data) => {
                setCategory(data.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Content Type</label>
            <Dropdown
              fluid
              placeholder="Select Content Type"
              selection
              options={options_contenttype}
              value={contentType}
              onChange={(e, data) => {
                setContentType(data.value);
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <Input
              fluid
              type="text"
              placeholder="Set Description"
              name="desc"
              value={desc || "Content Description"}
              onChange={(e, data) => {
                setDesc(data.value);
              }}
            />
          </Form.Field>
          {name ? (
            <ContentCardImage
              contentName={name}
              minHeight={320}
              fontSize={48}
            />
          ) : (
            <Segment style={{ minHeight: 320 }} secondary />
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Cancel" onClick={handleClose} />
        <Button
          primary
          labelPosition="right"
          content="Reset"
          icon="refresh"
          onClick={handleReset}
        />
        <Button
          positive
          labelPosition="right"
          icon="checkmark"
          content="Save"
          href="/"
          disabled={!(name && category)}
          onClick={handleSave}
          data-amplify-analytics-on="click"
          data-amplify-analytics-name="createContent-complete"
          data-amplify-analytics-attrs={`category:${category}`}
        />
      </Modal.Actions>
    </Modal>
  );
}

function ContentsListCardGroup({ items, pageViewOrigin, cardStyle }) {
  function contentCards() {
    return items.map((content) => (
      <Card
        key={content.id}
        as={Link}
        to={{ pathname: `/contents/${content.id}`, state: { pageViewOrigin } }}
        style={cardStyle}
      >
        <ContentCardImage
          contentName={content.name}
          minHeight={140}
          fontSize={26}
        />
        <Card.Content>
          <Card.Header>{content.name}</Card.Header>
          <Card.Meta>
            <Icon name="tag" /> {content.category}
          </Card.Meta>
        </Card.Content>
      </Card>
    ));
  }

  return <Card.Group centered>{contentCards()}</Card.Group>;
}

ContentsListCardGroup.propTypes = {
  items: PropTypes.array,
  pageViewOrigin: PropTypes.string,
  cardStyle: PropTypes.object,
};

function ContentsList() {
  const [contents, setContents] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const result = await API.graphql(
        graphqlOperation(queries.listContents, { limit: 45 })
      );
      const contents = result.data.listContents.items;
      setContents(contents);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    let contentSubscription;
    async function fetchData() {
      contentSubscription = await API.graphql(
        graphqlOperation(subscriptions.onCreateContent)
      ).subscribe({
        next: (contentData) => {
          const newContent = contentData.value.data.onCreateContent;
          setContents([...contents, newContent]);
        },
      });
    }
    fetchData();

    return () => {
      if (contentSubscription) {
        contentSubscription.unsubscribe();
      }
    };
  });

  document.title = "Oktank Edtech POC";
  return (
    <Container style={{ marginTop: 70 }}>
      <ContentsListCardGroup items={contents} pageViewOrigin="Browse" />
    </Container>
  );
}

function RecommendedContentsList({ recommendedContents }) {
  return (
    <Segment style={{ margin: "auto", width: "100%", maxWidth: 920 }}>
      <Header as="h2">Recommended items for you:</Header>
      {recommendedContents.length > 0 ? (
        <ContentsListCardGroup
          items={recommendedContents}
          pageViewOrigin="Recommendations"
          cardStyle={{ width: "100%", maxWidth: 220 }}
        />
      ) : (
        <Grid columns={3}>
          <Grid.Column>
            <Placeholder>
              <Placeholder.Image rectangular />
              <Placeholder.Line length="long" />
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column>
            <Placeholder>
              <Placeholder.Image rectangular />
              <Placeholder.Line length="long" />
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column>
            <Placeholder>
              <Placeholder.Image rectangular />
              <Placeholder.Line length="long" />
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
        </Grid>
      )}
    </Segment>
  );
}

RecommendedContentsList.propTypes = {
  recommendedContents: PropTypes.array,
};

function ContentDetails() {
  const params = useParams();

  const [content, setContent] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  //const [user, setUser] = React.useState();
  const [recommendedContents, setRecommendedContents] = React.useState([]);
  React.useEffect(() => {
    async function loadContentInfo() {
      const contentResult = await API.graphql(
        graphqlOperation(queries.getContent, { id: params.contentId })
      );
      const content = contentResult.data.getContent;
      setContent(content);
      setLoading(false);
      document.title = `${content.name} - Oktank Edtech`;

      let pageViewOrigin = "URL";
      if (params.locationState && params.locationState.pageViewOrigin) {
        pageViewOrigin = params.locationState.pageViewOrigin;
      }

      const user = await Auth.currentAuthenticatedUser();

      Analytics.record(
        {
          userId: user.attributes.sub,
          properties: {
            itemId: content.id,
            eventValue: 0,
            device: "MAC",
          },
          eventType: "Click",
        },
        "AmazonPersonalize"
      );

      const recommendedContentsResult = await API.graphql(
        graphqlOperation(queries.getRecommendations, {
          userId: user.attributes.sub,
          name: content.name,
        })
      );

      const recommendedContents =
        recommendedContentsResult.data.getRecommendations;

      setRecommendedContents(recommendedContents);

      Analytics.record(
        {
          data: {
            eventType: "Click",
            pageViewOrigin,
            userId: user.attributes.sub,
            itemId: content.id,
            itemName: content.name,
            itemCategory: content.category,
            eventValue: "0",
            device: "MAC",
            timestamp: new Date(),
          },
          streamName: "oktankcontentKinesis-dev", // TODO: Set to Kinesis Stream Name, and it has to include environment name too, e.g.: 'oktankcontentKinesis-dev'
        },
        "AWSKinesis"
      );
    }
    loadContentInfo();
    return () => {
      setContent({});
      setLoading(true);
      setRecommendedContents([]);
    };
  }, [params.contentId, params.locationState]);

  return (
    <Container>
      <NavLink to="/">
        <Icon name="arrow left" />
        Back to Contents list
      </NavLink>
      <Divider hidden />
      <Card
        key={content.id}
        style={{ width: "100%", maxWidth: 720, margin: "auto" }}
      >
        {loading ? (
          <Placeholder fluid style={{ minHeight: 320 }}>
            <Placeholder.Image />
          </Placeholder>
        ) : (
          <ContentCardImage
            contentName={content.name}
            minHeight={320}
            fontSize={48}
          />
        )}
        {loading ? (
          <Placeholder>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        ) : (
          <Card.Content>
            <Card.Header>{content.name}</Card.Header>
            <Card.Meta>
              <Icon name="tag" /> {content.category}
            </Card.Meta>
          </Card.Content>
        )}
      </Card>
      <Divider hidden />
      <RecommendedContentsList recommendedContents={recommendedContents} />
    </Container>
  );
}

ContentDetails.propTypes = {
  id: PropTypes.string,
  locationState: PropTypes.object,
};

function AuthStateApp() {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  document.title = "Oktank Edtech";
  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <Router>
        <Menu fixed="top" color="teal" inverted>
          <Menu.Menu>
            <Menu.Item header href="/">
              <Icon name="globe" />
              Oktank Edtech
            </Menu.Item>
          </Menu.Menu>
          <Menu.Menu position="right">
            <Menu.Item link>
              <ContentCreation />
            </Menu.Item>
            <Dropdown item simple text={user.username}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => Auth.signOut()}>
                  <Icon name="power off" />
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
        <Container style={{ marginTop: 70 }}>
          <Routes>
            <Route path="/" exact element={<ContentsList />} />
            <Route path="/contents/:contentId" element={<ContentDetails />} />
          </Routes>
        </Container>
      </Router>
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
        ]}
      />
    </AmplifyAuthenticator>
  );
}

export default AuthStateApp;
