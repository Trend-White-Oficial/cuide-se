import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Reports from '../pages/admin/Reports';
import Analytics from '../pages/admin/Analytics';

const AdminRoutes = () => {
    const { user } = React.useContext(AuthContext);

    if (!user || !user.isAdmin) {
        return <div>Acesso não autorizado</div>;
    }

    return (
        <Router>
            <Switch>
                <Route exact path="/admin" component={Dashboard} />
                <Route path="/admin/dashboard" component={Dashboard} />
                <Route path="/admin/users" component={Users} />
                <Route path="/admin/reports" component={Reports} />
                <Route path="/admin/analytics" component={Analytics} />
            </Switch>
        </Router>
    );
};

export default AdminRoutes;
