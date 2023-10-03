package api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class Utilisateur extends BaseEntityWithAudit {
    private String secuNumber;
    private String nom;
    private String prenom;
    private Date dateNaissance;
    private String nationalite;
    private String carteIdentitePath;
    private String photoPath;
    private String publicCode;
    @Column(unique = true)
    private String privateCode;
    private String telephone;
    private String adresse;
    @Column(unique = true)
    private String email;
    private String motDePasse;
}
