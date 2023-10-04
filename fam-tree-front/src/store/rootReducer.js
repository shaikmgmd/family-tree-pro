import adhesion from "./features/slices/adhesion";
import auth from "./features/slices/auth";
import user from "./features/slices/user";

const rootReducer = {
    adhesion,
    auth,
    user
};

export default rootReducer;