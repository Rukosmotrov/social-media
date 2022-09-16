import NewsPage from "../pages/news/NewsPage";
import MessagesPage from "../pages/messages/MessagesPage";
import SettingsPage from "../pages/SettingsPage";
import Subscribes from "../pages/subscribes/Subscribes";
import Profile from "../pages/profile/Profile";
import SignUpPage from "../pages/auth/SignUpPage";
import SignInPage from "../pages/auth/SignInPage";
import SearchedUser from "../pages/searchedUser/SearchedUser";
import Subscribers from "../pages/subscribers/Subscribers";
import SearchedUserSubscribers from "../pages/searchedUser/searchedUerSubscribers/SearchedUserSubscribers";
import SearchedUserSubscribes from "../pages/searchedUser/searchedUserSubscribes/SearchedUserSubscribes";

export const privateRoutes = [
    {
        path: '/home',
        element: Profile,
        auth: true
    },
    {
        path: '/user:id',
        element: SearchedUser,
        auth: true
    },
    {
        path: '/news',
        element: NewsPage,
        auth: true
    },
    {
        path: '/subscribes',
        element: Subscribes,
        auth: true
    },
    {
        path: '/subscribers',
        element: Subscribers,
        auth: true
    },
    {
        path: '/subscribes:id',
        element: SearchedUserSubscribes,
        auth: true
    },
    {
        path: '/subscribers:id',
        element: SearchedUserSubscribers,
        auth: true
    },
    {
        path: '/messages',
        element: MessagesPage,
        auth: true
    },
    {
        path: '/message:id',
        element: MessagesPage,
        auth: true
    },
    {
        path: '/settings',
        element: SettingsPage,
        auth: true
    },
    {
        path: '*',
        element: Profile
    },
];

export const publicRoutes = [
    {
        path: '/sign-in',
        element: SignInPage,
        auth: false
    },
    {
        path: '/sign-up',
        element: SignUpPage,
        auth: false
    },
    {
        path: '*',
        element:SignInPage
    }
];