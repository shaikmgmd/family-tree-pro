import adhesion from "./features/slices/adhesion";
import auth from "./features/slices/auth";
import user from "./features/slices/user";
import role from "./features/slices/role";
import tree from "./features/slices/tree";
import familytreeuser from "./features/slices/familytreeuser";

const rootReducer = {
    adhesion,
    auth,
    user,
    role,
    tree,
    familytreeuser
};

export default rootReducer;