package api.model.tree;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class EmailDTO {
    private String email;
    private Long nodeId;
}
